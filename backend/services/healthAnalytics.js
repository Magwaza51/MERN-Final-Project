const tf = require('@tensorflow/tfjs-node');

class HealthAnalytics {
  constructor() {
    this.healthRiskModel = null;
    this.loadModel();
  }

  async loadModel() {
    // In real implementation, load a trained model
    // For now, we'll use rule-based analytics
    console.log('Health Analytics initialized');
  }

  // Health risk assessment
  assessHealthRisk(healthData) {
    const { bloodPressure, bloodSugar, heartRate, weight, height, age } = healthData;
    let riskScore = 0;
    const alerts = [];

    // BMI calculation
    const bmi = weight / ((height / 100) ** 2);
    if (bmi > 30) {
      riskScore += 3;
      alerts.push({ type: 'warning', message: 'BMI indicates obesity - consult healthcare provider' });
    } else if (bmi > 25) {
      riskScore += 1;
      alerts.push({ type: 'info', message: 'BMI indicates overweight - consider lifestyle changes' });
    }

    // Blood pressure analysis
    if (bloodPressure) {
      const [systolic, diastolic] = bloodPressure.split('/').map(Number);
      if (systolic > 140 || diastolic > 90) {
        riskScore += 4;
        alerts.push({ type: 'critical', message: 'High blood pressure detected - seek immediate medical attention' });
      } else if (systolic > 120 || diastolic > 80) {
        riskScore += 2;
        alerts.push({ type: 'warning', message: 'Elevated blood pressure - monitor closely' });
      }
    }

    // Blood sugar analysis
    if (bloodSugar > 126) {
      riskScore += 4;
      alerts.push({ type: 'critical', message: 'High blood sugar - diabetes risk, consult doctor immediately' });
    } else if (bloodSugar > 100) {
      riskScore += 2;
      alerts.push({ type: 'warning', message: 'Elevated blood sugar - prediabetes risk' });
    }

    // Heart rate analysis
    if (heartRate > 100 || heartRate < 60) {
      riskScore += 2;
      alerts.push({ type: 'warning', message: 'Abnormal heart rate detected' });
    }

    return {
      riskScore,
      riskLevel: this.calculateRiskLevel(riskScore),
      alerts,
      recommendations: this.generateRecommendations(riskScore, healthData)
    };
  }

  calculateRiskLevel(score) {
    if (score >= 8) return 'HIGH';
    if (score >= 4) return 'MODERATE';
    if (score >= 2) return 'LOW';
    return 'MINIMAL';
  }

  generateRecommendations(riskScore, healthData) {
    const recommendations = [];

    if (riskScore >= 4) {
      recommendations.push('Schedule appointment with healthcare provider within 48 hours');
      recommendations.push('Monitor vital signs daily');
    }

    recommendations.push('Maintain regular exercise routine (30 min/day)');
    recommendations.push('Follow balanced diet with reduced sodium');
    recommendations.push('Ensure 7-8 hours of quality sleep');
    recommendations.push('Practice stress management techniques');

    return recommendations;
  }

  // Trend analysis
  analyzeTrends(healthRecords) {
    const trends = {};
    
    // Analyze last 30 days
    const recentRecords = healthRecords
      .filter(record => {
        const recordDate = new Date(record.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return recordDate >= thirtyDaysAgo;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (recentRecords.length < 2) return trends;

    // Blood pressure trend
    const bpTrend = this.calculateTrend(
      recentRecords.map(r => r.bloodPressure ? parseInt(r.bloodPressure.split('/')[0]) : null)
    );
    if (bpTrend) trends.bloodPressure = bpTrend;

    // Weight trend
    const weightTrend = this.calculateTrend(
      recentRecords.map(r => r.weight).filter(w => w !== null)
    );
    if (weightTrend) trends.weight = weightTrend;

    return trends;
  }

  calculateTrend(values) {
    const validValues = values.filter(v => v !== null && v !== undefined);
    if (validValues.length < 2) return null;

    const first = validValues[0];
    const last = validValues[validValues.length - 1];
    const change = ((last - first) / first) * 100;

    return {
      direction: change > 5 ? 'increasing' : change < -5 ? 'decreasing' : 'stable',
      change: Math.abs(change).toFixed(1),
      status: this.getTrendStatus(change)
    };
  }

  getTrendStatus(change) {
    if (Math.abs(change) < 5) return 'stable';
    return change > 0 ? 'increasing' : 'decreasing';
  }
}

module.exports = HealthAnalytics;