from flask import Blueprint, jsonify, request
from src.services.strategic_ai_service import strategic_ai_service

strategic_bp = Blueprint('strategic', __name__)

@strategic_bp.route('/strategic/business-analysis', methods=['POST'])
def strategic_business_analysis():
    """Perform comprehensive strategic business analysis"""
    data = request.json
    
    context = data.get('context', {})
    if not context:
        return jsonify({'error': 'Business context is required'}), 400
    
    result = strategic_ai_service.strategic_business_analysis(context)
    return jsonify(result)

@strategic_bp.route('/strategic/competitive-analysis', methods=['POST'])
def competitive_strategy_analysis():
    """Analyze competitive landscape and develop strategic recommendations"""
    data = request.json
    
    company_profile = data.get('company_profile', {})
    competitors = data.get('competitors', [])
    competitive_data = data.get('competitive_data', {})
    
    if not company_profile or not competitors:
        return jsonify({'error': 'company_profile and competitors are required'}), 400
    
    result = strategic_ai_service.competitive_strategy_analysis(
        company_profile=company_profile,
        competitors=competitors,
        competitive_data=competitive_data
    )
    return jsonify(result)

@strategic_bp.route('/strategic/growth-strategy', methods=['POST'])
def growth_strategy_planning():
    """Develop comprehensive growth strategy"""
    data = request.json
    
    current_state = data.get('current_state', {})
    growth_targets = data.get('growth_targets', {})
    resources = data.get('resources', {})
    
    if not current_state or not growth_targets:
        return jsonify({'error': 'current_state and growth_targets are required'}), 400
    
    result = strategic_ai_service.growth_strategy_planning(
        current_state=current_state,
        growth_targets=growth_targets,
        resources=resources
    )
    return jsonify(result)

@strategic_bp.route('/strategic/crisis-management', methods=['POST'])
def crisis_management_strategy():
    """Develop crisis management strategy"""
    data = request.json
    
    crisis_description = data.get('crisis_description')
    impact_assessment = data.get('impact_assessment', {})
    stakeholders = data.get('stakeholders', [])
    available_resources = data.get('available_resources', {})
    
    if not crisis_description:
        return jsonify({'error': 'crisis_description is required'}), 400
    
    result = strategic_ai_service.crisis_management_strategy(
        crisis_description=crisis_description,
        impact_assessment=impact_assessment,
        stakeholders=stakeholders,
        available_resources=available_resources
    )
    return jsonify(result)

@strategic_bp.route('/strategic/innovation-strategy', methods=['POST'])
def innovation_strategy_development():
    """Develop innovation strategy and roadmap"""
    data = request.json
    
    industry_context = data.get('industry_context', {})
    tech_trends = data.get('tech_trends', [])
    customer_needs = data.get('customer_needs', {})
    innovation_goals = data.get('innovation_goals', {})
    
    if not industry_context or not innovation_goals:
        return jsonify({'error': 'industry_context and innovation_goals are required'}), 400
    
    result = strategic_ai_service.innovation_strategy_development(
        industry_context=industry_context,
        tech_trends=tech_trends,
        customer_needs=customer_needs,
        innovation_goals=innovation_goals
    )
    return jsonify(result)

@strategic_bp.route('/strategic/decision-making', methods=['POST'])
def strategic_decision_making():
    """Support strategic decision-making with AI analysis"""
    data = request.json
    
    decision_context = data.get('decision_context', {})
    options = data.get('options', [])
    criteria = data.get('criteria', {})
    
    if not decision_context or not options:
        return jsonify({'error': 'decision_context and options are required'}), 400
    
    result = strategic_ai_service.strategic_decision_making(
        decision_context=decision_context,
        options=options,
        criteria=criteria
    )
    return jsonify(result)

@strategic_bp.route('/strategic/market-opportunity', methods=['POST'])
def market_opportunity_analysis():
    """Analyze market opportunities and strategic fit"""
    data = request.json
    
    market_data = data.get('market_data', {})
    company_capabilities = data.get('company_capabilities', {})
    
    if not market_data or not company_capabilities:
        return jsonify({'error': 'market_data and company_capabilities are required'}), 400
    
    result = strategic_ai_service.market_opportunity_analysis(
        market_data=market_data,
        company_capabilities=company_capabilities
    )
    return jsonify(result)

@strategic_bp.route('/strategic/planning-session', methods=['POST'])
def strategic_planning_session():
    """Conduct a comprehensive strategic planning session"""
    data = request.json
    
    planning_context = data.get('planning_context', {})
    
    if not planning_context:
        return jsonify({'error': 'planning_context is required'}), 400
    
    result = strategic_ai_service.strategic_planning_session(planning_context)
    return jsonify(result)

# Quick strategic insights endpoints
@strategic_bp.route('/strategic/quick-insights', methods=['POST'])
def quick_strategic_insights():
    """Get quick strategic insights for immediate decision support"""
    data = request.json
    
    business_question = data.get('question')
    context = data.get('context', {})
    urgency = data.get('urgency', 'normal')  # low, normal, high, critical
    
    if not business_question:
        return jsonify({'error': 'Business question is required'}), 400
    
    # Adjust response based on urgency
    max_tokens = {
        'low': 500,
        'normal': 1000,
        'high': 1500,
        'critical': 800  # Concise but comprehensive for critical decisions
    }.get(urgency, 1000)
    
    temperature = {
        'low': 0.5,
        'normal': 0.3,
        'high': 0.3,
        'critical': 0.2  # Very focused for critical decisions
    }.get(urgency, 0.3)
    
    from src.services.ai_service import ai_service
    
    prompt = f"""
    As a strategic business advisor, provide immediate strategic insights for this urgent business question:
    
    Question: {business_question}
    Context: {context}
    Urgency Level: {urgency}
    
    Provide:
    1. Key strategic considerations
    2. Immediate recommendations
    3. Potential risks and opportunities
    4. Next steps and timeline
    
    Keep response focused and actionable given the {urgency} urgency level.
    """
    
    result = ai_service.generate_text(
        prompt=prompt,
        provider='openai',
        model='gpt-4.5-turbo',
        max_tokens=max_tokens,
        temperature=temperature
    )
    
    if result['success']:
        return jsonify({
            'success': True,
            'insights': result['text'],
            'question': business_question,
            'urgency': urgency,
            'context': context,
            'generated_at': result.get('timestamp')
        })
    else:
        return jsonify(result), 500

@strategic_bp.route('/strategic/swot-analysis', methods=['POST'])
def swot_analysis():
    """Generate SWOT analysis for strategic planning"""
    data = request.json
    
    company_info = data.get('company_info', {})
    market_context = data.get('market_context', {})
    
    if not company_info:
        return jsonify({'error': 'company_info is required'}), 400
    
    from src.services.ai_service import ai_service
    
    prompt = f"""
    As a strategic analyst, conduct a comprehensive SWOT analysis:
    
    Company Information: {company_info}
    Market Context: {market_context}
    
    Provide a detailed SWOT analysis with:
    
    STRENGTHS:
    - Internal capabilities and advantages
    - Unique value propositions
    - Competitive advantages
    
    WEAKNESSES:
    - Internal limitations and gaps
    - Areas for improvement
    - Competitive disadvantages
    
    OPPORTUNITIES:
    - Market opportunities
    - Emerging trends to leverage
    - Strategic partnerships potential
    
    THREATS:
    - Market threats and challenges
    - Competitive threats
    - External risks
    
    For each category, provide specific, actionable insights with strategic implications.
    """
    
    result = ai_service.generate_text(
        prompt=prompt,
        provider='openai',
        model='gpt-4.5-turbo',
        max_tokens=2000,
        temperature=0.3
    )
    
    if result['success']:
        return jsonify({
            'success': True,
            'swot_analysis': result['text'],
            'company_info': company_info,
            'market_context': market_context,
            'generated_at': result.get('timestamp')
        })
    else:
        return jsonify(result), 500

@strategic_bp.route('/strategic/scenario-planning', methods=['POST'])
def scenario_planning():
    """Generate scenario planning for strategic decision-making"""
    data = request.json
    
    base_scenario = data.get('base_scenario', {})
    variables = data.get('variables', [])
    time_horizon = data.get('time_horizon', '2-3 years')
    
    if not base_scenario:
        return jsonify({'error': 'base_scenario is required'}), 400
    
    from src.services.ai_service import ai_service
    
    prompt = f"""
    As a scenario planning expert, develop strategic scenarios for planning purposes:
    
    Base Scenario: {base_scenario}
    Key Variables: {variables}
    Time Horizon: {time_horizon}
    
    Develop 3-4 distinct scenarios:
    
    1. OPTIMISTIC SCENARIO
       - Best-case assumptions
       - Favorable market conditions
       - Strategic implications and opportunities
    
    2. PESSIMISTIC SCENARIO
       - Worst-case assumptions
       - Challenging market conditions
       - Risk mitigation strategies
    
    3. MOST LIKELY SCENARIO
       - Realistic assumptions
       - Expected market conditions
       - Balanced strategic approach
    
    4. DISRUPTIVE SCENARIO (if applicable)
       - Unexpected market disruptions
       - Technology or regulatory changes
       - Adaptive strategies required
    
    For each scenario, provide:
    - Key assumptions and drivers
    - Strategic implications
    - Recommended actions
    - Success metrics
    """
    
    result = ai_service.generate_text(
        prompt=prompt,
        provider='openai',
        model='gpt-4.5-turbo',
        max_tokens=2500,
        temperature=0.4
    )
    
    if result['success']:
        return jsonify({
            'success': True,
            'scenario_planning': result['text'],
            'base_scenario': base_scenario,
            'variables': variables,
            'time_horizon': time_horizon,
            'generated_at': result.get('timestamp')
        })
    else:
        return jsonify(result), 500

@strategic_bp.route('/strategic/health', methods=['GET'])
def strategic_health():
    """Check strategic AI service health"""
    from src.services.ai_service import ai_service
    
    # Test strategic AI capabilities
    test_result = ai_service.generate_text(
        prompt="Provide a brief strategic insight about business growth.",
        provider='openai',
        model='gpt-4.5-turbo',
        max_tokens=100,
        temperature=0.3
    )
    
    return jsonify({
        'service_status': 'healthy',
        'strategic_models_available': strategic_ai_service.strategic_models,
        'default_provider': strategic_ai_service.default_strategic_provider,
        'test_generation': test_result.get('success', False),
        'timestamp': test_result.get('timestamp')
    })

