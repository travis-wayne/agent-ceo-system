from flask import Blueprint, jsonify, request, current_app
import os
import tempfile
from werkzeug.utils import secure_filename
from src.services.data_analysis_service import data_analysis_service

data_analysis_bp = Blueprint('data_analysis', __name__)

# File upload configuration
ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls', 'json', 'pdf', 'docx', 'txt'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@data_analysis_bp.route('/data-analysis/upload', methods=['POST'])
def upload_and_analyze_file():
    """Upload and analyze a data file"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not supported'}), 400
    
    # Get analysis context from form data
    analysis_context = {
        'purpose': request.form.get('purpose', 'general'),
        'industry': request.form.get('industry', ''),
        'focus_area': request.form.get('focus_area', ''),
        'business_goals': request.form.get('business_goals', '')
    }
    
    try:
        # Save file temporarily
        filename = secure_filename(file.filename)
        temp_dir = tempfile.mkdtemp()
        file_path = os.path.join(temp_dir, filename)
        file.save(file_path)
        
        # Determine file type and analyze
        file_extension = filename.rsplit('.', 1)[1].lower()
        
        if file_extension == 'csv':
            with open(file_path, 'r', encoding='utf-8') as f:
                csv_content = f.read()
            result = data_analysis_service.parse_csv_data(csv_content, analysis_context)
        
        elif file_extension in ['xlsx', 'xls']:
            sheet_name = request.form.get('sheet_name')
            result = data_analysis_service.parse_excel_data(file_path, sheet_name, analysis_context)
        
        elif file_extension == 'json':
            with open(file_path, 'r', encoding='utf-8') as f:
                json_content = f.read()
            result = data_analysis_service.parse_json_data(json_content, analysis_context)
        
        elif file_extension == 'pdf':
            result = data_analysis_service.parse_pdf_document(file_path, analysis_context)
        
        elif file_extension == 'docx':
            result = data_analysis_service.parse_word_document(file_path, analysis_context)
        
        else:
            result = {'success': False, 'error': 'Unsupported file type'}
        
        # Clean up temporary file
        os.remove(file_path)
        os.rmdir(temp_dir)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@data_analysis_bp.route('/data-analysis/csv', methods=['POST'])
def analyze_csv_data():
    """Analyze CSV data provided directly"""
    data = request.json
    
    csv_content = data.get('csv_content')
    analysis_context = data.get('analysis_context', {})
    
    if not csv_content:
        return jsonify({'error': 'csv_content is required'}), 400
    
    result = data_analysis_service.parse_csv_data(csv_content, analysis_context)
    return jsonify(result)

@data_analysis_bp.route('/data-analysis/json', methods=['POST'])
def analyze_json_data():
    """Analyze JSON data provided directly"""
    data = request.json
    
    json_data = data.get('json_data')
    analysis_context = data.get('analysis_context', {})
    
    if not json_data:
        return jsonify({'error': 'json_data is required'}), 400
    
    result = data_analysis_service.parse_json_data(json_data, analysis_context)
    return jsonify(result)

@data_analysis_bp.route('/data-analysis/competitive', methods=['POST'])
def competitive_analysis():
    """Generate competitive analysis"""
    data = request.json
    
    competitor_data = data.get('competitor_data', [])
    company_focus = data.get('company_focus', 'general business')
    
    if not competitor_data:
        return jsonify({'error': 'competitor_data is required'}), 400
    
    result = data_analysis_service.generate_competitive_analysis(
        competitor_data=competitor_data,
        company_focus=company_focus
    )
    
    return jsonify(result)

@data_analysis_bp.route('/data-analysis/financial', methods=['POST'])
def financial_analysis():
    """Generate financial analysis"""
    data = request.json
    
    financial_data = data.get('financial_data', {})
    time_period = data.get('time_period', 'current period')
    context = data.get('context', 'general financial analysis')
    
    if not financial_data:
        return jsonify({'error': 'financial_data is required'}), 400
    
    result = data_analysis_service.generate_financial_analysis(
        financial_data=financial_data,
        time_period=time_period,
        context=context
    )
    
    return jsonify(result)

@data_analysis_bp.route('/data-analysis/customer', methods=['POST'])
def customer_analysis():
    """Generate customer analysis"""
    data = request.json
    
    customer_data = data.get('customer_data', {})
    focus = data.get('focus', 'customer behavior')
    goals = data.get('goals', 'improve customer experience')
    
    if not customer_data:
        return jsonify({'error': 'customer_data is required'}), 400
    
    result = data_analysis_service.generate_customer_analysis(
        customer_data=customer_data,
        focus=focus,
        goals=goals
    )
    
    return jsonify(result)

@data_analysis_bp.route('/data-analysis/market', methods=['POST'])
def market_analysis():
    """Generate market analysis"""
    data = request.json
    
    market_data = data.get('market_data', {})
    scope = data.get('scope', 'market overview')
    industry = data.get('industry', 'technology')
    
    if not market_data:
        return jsonify({'error': 'market_data is required'}), 400
    
    result = data_analysis_service.generate_market_analysis(
        market_data=market_data,
        scope=scope,
        industry=industry
    )
    
    return jsonify(result)

@data_analysis_bp.route('/data-analysis/health', methods=['GET'])
def data_analysis_health():
    """Check data analysis service health"""
    result = data_analysis_service.health_check()
    return jsonify(result)

# Advanced analysis endpoints
@data_analysis_bp.route('/data-analysis/trends', methods=['POST'])
def trend_analysis():
    """Analyze trends in time-series data"""
    data = request.json
    
    time_series_data = data.get('time_series_data', [])
    metrics = data.get('metrics', [])
    time_period = data.get('time_period', 'monthly')
    
    if not time_series_data:
        return jsonify({'error': 'time_series_data is required'}), 400
    
    from src.services.ai_service import ai_service
    
    prompt = f"""
    Analyze the following time-series data for trends and patterns:
    
    Data: {time_series_data}
    Metrics: {metrics}
    Time Period: {time_period}
    
    Provide:
    1. Trend analysis (upward, downward, seasonal, cyclical)
    2. Key pattern identification
    3. Anomaly detection
    4. Forecasting insights
    5. Business implications
    6. Recommendations for optimization
    
    Focus on actionable insights for business decision-making.
    """
    
    result = ai_service.generate_text(
        prompt=prompt,
        max_tokens=1500,
        temperature=0.3
    )
    
    if result['success']:
        return jsonify({
            'success': True,
            'analysis_type': 'trend_analysis',
            'analysis': result['text'],
            'data_points': len(time_series_data),
            'time_period': time_period,
            'generated_at': result.get('timestamp')
        })
    else:
        return jsonify(result), 500

@data_analysis_bp.route('/data-analysis/kpi-dashboard', methods=['POST'])
def kpi_analysis():
    """Generate KPI analysis and dashboard insights"""
    data = request.json
    
    kpi_data = data.get('kpi_data', {})
    business_goals = data.get('business_goals', [])
    time_frame = data.get('time_frame', 'current quarter')
    
    if not kpi_data:
        return jsonify({'error': 'kpi_data is required'}), 400
    
    from src.services.ai_service import ai_service
    
    prompt = f"""
    Analyze the following KPI data and provide dashboard insights:
    
    KPI Data: {kpi_data}
    Business Goals: {business_goals}
    Time Frame: {time_frame}
    
    Provide:
    1. KPI performance summary
    2. Goal achievement analysis
    3. Performance trends and patterns
    4. Areas of concern and opportunity
    5. Recommended actions for improvement
    6. Dashboard visualization suggestions
    
    Focus on executive-level insights and actionable recommendations.
    """
    
    result = ai_service.generate_text(
        prompt=prompt,
        max_tokens=1500,
        temperature=0.3
    )
    
    if result['success']:
        return jsonify({
            'success': True,
            'analysis_type': 'kpi_analysis',
            'analysis': result['text'],
            'kpis_analyzed': len(kpi_data),
            'time_frame': time_frame,
            'generated_at': result.get('timestamp')
        })
    else:
        return jsonify(result), 500

@data_analysis_bp.route('/data-analysis/sentiment', methods=['POST'])
def sentiment_analysis():
    """Analyze sentiment in text data"""
    data = request.json
    
    text_data = data.get('text_data', [])
    context = data.get('context', 'customer feedback')
    
    if not text_data:
        return jsonify({'error': 'text_data is required'}), 400
    
    from src.services.ai_service import ai_service
    
    # Combine text data for analysis
    combined_text = '\n'.join(text_data) if isinstance(text_data, list) else str(text_data)
    
    prompt = f"""
    Analyze the sentiment and themes in the following text data:
    
    Text Data: {combined_text[:3000]}  # Limit for analysis
    Context: {context}
    
    Provide:
    1. Overall sentiment analysis (positive, negative, neutral percentages)
    2. Key themes and topics identified
    3. Emotional indicators and intensity
    4. Specific concerns or praise points
    5. Actionable insights for improvement
    6. Recommendations for response strategy
    
    Focus on business-relevant insights and customer experience implications.
    """
    
    result = ai_service.generate_text(
        prompt=prompt,
        max_tokens=1200,
        temperature=0.4
    )
    
    if result['success']:
        return jsonify({
            'success': True,
            'analysis_type': 'sentiment_analysis',
            'analysis': result['text'],
            'text_samples_analyzed': len(text_data) if isinstance(text_data, list) else 1,
            'context': context,
            'generated_at': result.get('timestamp')
        })
    else:
        return jsonify(result), 500

@data_analysis_bp.route('/data-analysis/cohort', methods=['POST'])
def cohort_analysis():
    """Perform cohort analysis on customer data"""
    data = request.json
    
    cohort_data = data.get('cohort_data', [])
    analysis_type = data.get('analysis_type', 'retention')
    time_period = data.get('time_period', 'monthly')
    
    if not cohort_data:
        return jsonify({'error': 'cohort_data is required'}), 400
    
    from src.services.ai_service import ai_service
    
    prompt = f"""
    Perform cohort analysis on the following customer data:
    
    Cohort Data: {cohort_data}
    Analysis Type: {analysis_type}
    Time Period: {time_period}
    
    Provide:
    1. Cohort performance summary
    2. Retention/conversion patterns by cohort
    3. Trends across different time periods
    4. Factors influencing cohort performance
    5. Insights for customer lifecycle optimization
    6. Recommendations for improving metrics
    
    Focus on actionable insights for customer retention and growth.
    """
    
    result = ai_service.generate_text(
        prompt=prompt,
        max_tokens=1500,
        temperature=0.3
    )
    
    if result['success']:
        return jsonify({
            'success': True,
            'analysis_type': 'cohort_analysis',
            'analysis': result['text'],
            'cohorts_analyzed': len(cohort_data),
            'analysis_focus': analysis_type,
            'time_period': time_period,
            'generated_at': result.get('timestamp')
        })
    else:
        return jsonify(result), 500

@data_analysis_bp.route('/data-analysis/predictive', methods=['POST'])
def predictive_analysis():
    """Generate predictive insights from historical data"""
    data = request.json
    
    historical_data = data.get('historical_data', [])
    prediction_target = data.get('prediction_target', 'revenue')
    time_horizon = data.get('time_horizon', '3 months')
    factors = data.get('factors', [])
    
    if not historical_data:
        return jsonify({'error': 'historical_data is required'}), 400
    
    from src.services.ai_service import ai_service
    
    prompt = f"""
    Analyze the following historical data and provide predictive insights:
    
    Historical Data: {historical_data}
    Prediction Target: {prediction_target}
    Time Horizon: {time_horizon}
    Influencing Factors: {factors}
    
    Provide:
    1. Trend analysis and pattern identification
    2. Predictive insights for the target metric
    3. Confidence levels and uncertainty factors
    4. Scenario analysis (best case, worst case, most likely)
    5. Key drivers and influencing factors
    6. Recommendations for achieving desired outcomes
    7. Risk factors and mitigation strategies
    
    Focus on actionable predictions that can guide business planning.
    """
    
    result = ai_service.generate_text(
        prompt=prompt,
        max_tokens=1800,
        temperature=0.3
    )
    
    if result['success']:
        return jsonify({
            'success': True,
            'analysis_type': 'predictive_analysis',
            'analysis': result['text'],
            'data_points': len(historical_data),
            'prediction_target': prediction_target,
            'time_horizon': time_horizon,
            'generated_at': result.get('timestamp')
        })
    else:
        return jsonify(result), 500

# Data quality and validation endpoints
@data_analysis_bp.route('/data-analysis/quality-check', methods=['POST'])
def data_quality_check():
    """Perform data quality analysis"""
    data = request.json
    
    dataset = data.get('dataset', {})
    quality_criteria = data.get('quality_criteria', ['completeness', 'accuracy', 'consistency'])
    
    if not dataset:
        return jsonify({'error': 'dataset is required'}), 400
    
    from src.services.ai_service import ai_service
    
    prompt = f"""
    Analyze the data quality of the following dataset:
    
    Dataset: {dataset}
    Quality Criteria: {quality_criteria}
    
    Evaluate and provide:
    1. Data completeness assessment
    2. Data accuracy indicators
    3. Consistency and format validation
    4. Duplicate detection
    5. Outlier identification
    6. Data quality score and recommendations
    7. Suggested data cleaning steps
    
    Focus on practical steps to improve data quality for analysis.
    """
    
    result = ai_service.generate_text(
        prompt=prompt,
        max_tokens=1200,
        temperature=0.3
    )
    
    if result['success']:
        return jsonify({
            'success': True,
            'analysis_type': 'data_quality_check',
            'analysis': result['text'],
            'quality_criteria': quality_criteria,
            'generated_at': result.get('timestamp')
        })
    else:
        return jsonify(result), 500

