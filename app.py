from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import random
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Sample food database (in a real app, this would be more extensive or use an external API)
FOOD_DATABASE = []
try:
    if os.path.exists('data/food_database.json'):
        with open('data/food_database.json', 'r') as f:
            FOOD_DATABASE = json.load(f)
        logger.info(f"Loaded {len(FOOD_DATABASE)} food items from database")
    else:
        logger.warning("Food database not found. Will be created on startup.")
except Exception as e:
    logger.error(f"Error loading food database: {e}")

@app.route('/')
def home():
    return jsonify({
        "message": "NutriBot AI Recommendation Service",
        "status": "running"
    })

@app.route('/api/recommend/meals', methods=['POST'])
def recommend_meals():
    """
    Generate meal recommendations based on user profile and goals
    """
    try:
        data = request.json
        
        if not data:
            return jsonify({
                'error': 'Request body is required'
            }), 400
    except Exception as e:
        logger.error(f"Error parsing request: {e}")
        return jsonify({
            'error': 'Invalid JSON in request body'
        }), 400
    
    # Extract user information
    user_profile = data.get('profile', {})
    goal = user_profile.get('goal', 'maintenance')
    dietary_restrictions = user_profile.get('dietaryRestrictions', [])
    allergies = user_profile.get('allergies', [])
    
    
    # Calculate daily calorie needs (simplified)
    try:
        weight = float(user_profile.get('weight', 70))  # kg
        height = float(user_profile.get('height', 170))  # cm
        age = int(user_profile.get('age', 30))
        gender = user_profile.get('gender', 'male')
        activity_level = user_profile.get('activityLevel', 'moderate')
        
        # Validate ranges
        if weight <= 0 or height <= 0 or age <= 0:
            return jsonify({
                'error': 'Invalid profile values. Weight, height, and age must be positive numbers.'
            }), 400
    except (ValueError, TypeError) as e:
        logger.error(f"Invalid profile data: {e}")
        return jsonify({
            'error': 'Invalid data types in user profile'
        }), 400
    
    # Basic BMR calculation using Harris-Benedict equation
    if gender == 'male':
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    else:
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
    
    # Adjust for activity level
    activity_multipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'active': 1.725,
        'very_active': 1.9
    }
    
    daily_calories = bmr * activity_multipliers.get(activity_level, 1.55)
    
    # Adjust based on goal
    if goal == 'weight_loss':
        daily_calories *= 0.8  # 20% deficit
    elif goal == 'weight_gain' or goal == 'muscle_gain':
        daily_calories *= 1.15  # 15% surplus
    
    # Calculate macronutrient distribution
    protein_ratio = 0.3  # 30% of calories from protein
    carb_ratio = 0.4     # 40% of calories from carbs
    fat_ratio = 0.3      # 30% of calories from fat
    
    # If muscle gain, increase protein
    if goal == 'muscle_gain':
        protein_ratio = 0.35
        carb_ratio = 0.45
        fat_ratio = 0.2
    
    # If weight loss, slightly reduce carbs
    if goal == 'weight_loss':
        protein_ratio = 0.35
        carb_ratio = 0.35
        fat_ratio = 0.3
    
    daily_protein = (daily_calories * protein_ratio) / 4  # 4 calories per gram of protein
    daily_carbs = (daily_calories * carb_ratio) / 4      # 4 calories per gram of carbs
    daily_fat = (daily_calories * fat_ratio) / 9         # 9 calories per gram of fat
    
    # Filter foods based on dietary restrictions and allergies
    filtered_foods = FOOD_DATABASE.copy()
    
    # Check if database is empty
    if not filtered_foods:
        logger.warning("Food database is empty")
        return jsonify({
            'error': 'Food database is not available. Please contact administrator.'
        }), 503
    
    for restriction in dietary_restrictions:
        filtered_foods = [food for food in filtered_foods if restriction.lower() not in food.get('restrictions', [])]
    
    for allergy in allergies:
        filtered_foods = [food for food in filtered_foods if allergy.lower() not in food.get('allergens', [])]
    
    # Generate meal plan
    breakfast_options = [food for food in filtered_foods if 'breakfast' in food.get('meal_type', [])]
    lunch_options = [food for food in filtered_foods if 'lunch' in food.get('meal_type', [])]
    dinner_options = [food for food in filtered_foods if 'dinner' in food.get('meal_type', [])]
    snack_options = [food for food in filtered_foods if 'snack' in food.get('meal_type', [])]
    
    # Check if we have enough options
    if not breakfast_options or not lunch_options or not dinner_options:
        logger.warning("Insufficient meal options in database")
        return jsonify({
            'error': 'Insufficient meal options available'
        }), 503
    
    # Select random meals (in a real app, this would use more sophisticated algorithms)
    breakfast = random.sample(breakfast_options, min(3, len(breakfast_options)))
    lunch = random.sample(lunch_options, min(3, len(lunch_options)))
    dinner = random.sample(dinner_options, min(3, len(dinner_options)))
    snacks = random.sample(snack_options, min(4, len(snack_options))) if snack_options else []
    
    # Prepare response
    meal_plan = {
        'daily_calories': round(daily_calories),
        'daily_protein': round(daily_protein),
        'daily_carbs': round(daily_carbs),
        'daily_fat': round(daily_fat),
        'meals': {
            'breakfast': breakfast,
            'lunch': lunch,
            'dinner': dinner,
            'snacks': snacks
        }
    }
    
    return jsonify({
        'meal_plan': meal_plan,
        'recommendations': {
            'goal': goal,
            'message': f"Based on your {goal} goal, we recommend consuming approximately {round(daily_calories)} calories per day."
        }
    })

@app.route('/api/generate/diet-plan', methods=['POST'])
def generate_diet_plan():
    """
    Generate a complete diet plan for a specified duration
    """
    try:
        data = request.json
        
        if not data:
            return jsonify({
                'error': 'Request body is required'
            }), 400
        
        # Extract user information
        user_profile = data.get('profile', {})
        
        if not user_profile:
            return jsonify({
                'error': 'User profile is required'
            }), 400
        
        duration_days = data.get('duration', 7)  # Default to 7-day plan
        
        try:
            duration_days = int(duration_days)
            if duration_days < 1 or duration_days > 30:
                return jsonify({
                    'error': 'Duration must be between 1 and 30 days'
                }), 400
        except (ValueError, TypeError):
            return jsonify({
                'error': 'Duration must be a valid number'
            }), 400
    
        
        goal = user_profile.get('goal', 'maintenance')
        
        # Get meal recommendations first by calling the recommend_meals function
        # Create a temporary request context
        from flask import Request
        temp_request = {
            'profile': user_profile
        }
        
        # Call recommend_meals internally
        with app.test_request_context(
            '/api/recommend/meals',
            method='POST',
            json=temp_request
        ):
            meal_response = recommend_meals()
            
            # Check if recommend_meals returned an error
            if isinstance(meal_response, tuple) and meal_response[1] >= 400:
                return meal_response
            
            meal_data = meal_response.get_json()
            
            if not meal_data or 'meal_plan' not in meal_data:
                return jsonify({
                    'error': 'Failed to generate meal recommendations'
                }), 500
    
        
        diet_plan = {
            'name': f"{goal.replace('_', ' ').title()} Plan",
            'description': f"A {duration_days}-day personalized diet plan for {goal.replace('_', ' ')}",
            'goal': goal,
            'dailyCalories': meal_data['meal_plan']['daily_calories'],
            'dailyProtein': meal_data['meal_plan']['daily_protein'],
            'dailyCarbs': meal_data['meal_plan']['daily_carbs'],
            'dailyFat': meal_data['meal_plan']['daily_fat'],
            'days': []
        }
        
        # Check if we have meals
        meals = meal_data['meal_plan']['meals']
        if not meals.get('breakfast') or not meals.get('lunch') or not meals.get('dinner'):
            return jsonify({
                'error': 'Insufficient meal data to generate diet plan'
            }), 500
    
        
        # Generate meals for each day
        for day in range(1, duration_days + 1):
            # For variety, we'd normally generate different meals for each day
            # But for simplicity, we'll use the same recommendations with slight variations
            
            breakfast = random.choice(meals['breakfast'])
            lunch = random.choice(meals['lunch'])
            dinner = random.choice(meals['dinner'])
            
            snacks_list = meals.get('snacks', [])
            if len(snacks_list) >= 2:
                snack1 = random.choice(snacks_list)
                snack2 = random.choice(snacks_list)
            elif len(snacks_list) == 1:
                snack1 = snacks_list[0]
                snack2 = snacks_list[0]
            else:
                # Create default snack if none available
                snack1 = snack2 = {
                    'name': 'Fruit',
                    'calories': 100,
                    'protein': 1,
                    'carbs': 25,
                    'fat': 0,
                    'ingredients': ['fruit'],
                    'instructions': 'Eat fresh fruit'
                }
        
            
            # Add slight variations to calories for realism
            variation = random.uniform(0.95, 1.05)
            
            day_plan = {
                'day': day,
                'meals': [
                    {
                        'type': 'breakfast',
                        'name': breakfast['name'],
                        'calories': round(breakfast['calories'] * variation),
                        'protein': round(breakfast['protein'] * variation, 1),
                        'carbs': round(breakfast['carbs'] * variation, 1),
                        'fat': round(breakfast['fat'] * variation, 1),
                        'ingredients': breakfast.get('ingredients', []),
                        'instructions': breakfast.get('instructions', 'No specific instructions.')
                    },
                    {
                        'type': 'lunch',
                        'name': lunch['name'],
                        'calories': round(lunch['calories'] * variation),
                        'protein': round(lunch['protein'] * variation, 1),
                        'carbs': round(lunch['carbs'] * variation, 1),
                        'fat': round(lunch['fat'] * variation, 1),
                        'ingredients': lunch.get('ingredients', []),
                        'instructions': lunch.get('instructions', 'No specific instructions.')
                    },
                    {
                        'type': 'dinner',
                        'name': dinner['name'],
                        'calories': round(dinner['calories'] * variation),
                        'protein': round(dinner['protein'] * variation, 1),
                        'carbs': round(dinner['carbs'] * variation, 1),
                        'fat': round(dinner['fat'] * variation, 1),
                        'ingredients': dinner.get('ingredients', []),
                        'instructions': dinner.get('instructions', 'No specific instructions.')
                    },
                    {
                        'type': 'snack',
                        'name': snack1['name'],
                        'calories': round(snack1['calories'] * variation),
                        'protein': round(snack1['protein'] * variation, 1),
                        'carbs': round(snack1['carbs'] * variation, 1),
                        'fat': round(snack1['fat'] * variation, 1),
                        'ingredients': snack1.get('ingredients', []),
                        'instructions': snack1.get('instructions', 'No specific instructions.')
                    },
                    {
                        'type': 'snack',
                        'name': snack2['name'],
                        'calories': round(snack2['calories'] * variation),
                        'protein': round(snack2['protein'] * variation, 1),
                        'carbs': round(snack2['carbs'] * variation, 1),
                        'fat': round(snack2['fat'] * variation, 1),
                        'ingredients': snack2.get('ingredients', []),
                        'instructions': snack2.get('instructions', 'No specific instructions.')
                    }
                ]
            }
            
            diet_plan['days'].append(day_plan)
        
        return jsonify({
            'diet_plan': diet_plan,
            'message': f"Successfully generated a {duration_days}-day diet plan for {goal.replace('_', ' ')}."
        })
    
    except Exception as e:
        logger.error(f"Error generating diet plan: {e}")
        return jsonify({
            'error': 'Internal server error while generating diet plan',
            'message': str(e)
        }), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {error}")
    return jsonify({
        'error': 'Internal server error'
    }), 500

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        'error': 'Method not allowed'
    }), 405

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'NutriBot AI Service',
        'version': '1.0.0'
    }), 200

if __name__ == '__main__':
    # Create data directory if it doesn't exist
    os.makedirs('data', exist_ok=True)
    
    # Create a sample food database if it doesn't exist
    if not os.path.exists('data/food_database.json'):
        sample_foods = [
            {
                "id": 1,
                "name": "Oatmeal with Berries",
                "description": "Hearty oatmeal topped with mixed berries and a drizzle of honey",
                "calories": 350,
                "protein": 12,
                "carbs": 60,
                "fat": 7,
                "fiber": 8,
                "meal_type": ["breakfast"],
                "ingredients": ["rolled oats", "milk", "mixed berries", "honey", "cinnamon"],
                "instructions": "Cook oats with milk, top with berries, honey, and cinnamon.",
                "restrictions": [],
                "allergens": ["dairy"]
            },
            {
                "id": 2,
                "name": "Grilled Chicken Salad",
                "description": "Fresh salad with grilled chicken, mixed greens, and balsamic vinaigrette",
                "calories": 420,
                "protein": 35,
                "carbs": 25,
                "fat": 18,
                "fiber": 6,
                "meal_type": ["lunch"],
                "ingredients": ["chicken breast", "mixed greens", "cherry tomatoes", "cucumber", "balsamic vinaigrette"],
                "instructions": "Grill chicken, slice, and place over mixed greens with vegetables. Drizzle with vinaigrette.",
                "restrictions": [],
                "allergens": []
            },
            {
                "id": 3,
                "name": "Salmon with Roasted Vegetables",
                "description": "Baked salmon fillet with a variety of roasted vegetables",
                "calories": 480,
                "protein": 40,
                "carbs": 30,
                "fat": 22,
                "fiber": 8,
                "meal_type": ["dinner"],
                "ingredients": ["salmon fillet", "broccoli", "carrots", "bell peppers", "olive oil", "lemon", "herbs"],
                "instructions": "Season salmon and roast with vegetables at 400°F for 15-20 minutes.",
                "restrictions": [],
                "allergens": ["fish"]
            },
            {
                "id": 4,
                "name": "Greek Yogurt with Honey and Nuts",
                "description": "Creamy Greek yogurt topped with honey and mixed nuts",
                "calories": 220,
                "protein": 18,
                "carbs": 15,
                "fat": 10,
                "fiber": 2,
                "meal_type": ["breakfast", "snack"],
                "ingredients": ["Greek yogurt", "honey", "mixed nuts"],
                "instructions": "Top yogurt with honey and nuts.",
                "restrictions": [],
                "allergens": ["dairy", "nuts"]
            },
            {
                "id": 5,
                "name": "Quinoa Bowl with Roasted Vegetables",
                "description": "Nutritious quinoa bowl with roasted vegetables and tahini dressing",
                "calories": 380,
                "protein": 15,
                "carbs": 55,
                "fat": 12,
                "fiber": 10,
                "meal_type": ["lunch", "dinner"],
                "ingredients": ["quinoa", "sweet potato", "broccoli", "chickpeas", "tahini", "lemon juice"],
                "instructions": "Cook quinoa. Roast vegetables and chickpeas. Combine and drizzle with tahini dressing.",
                "restrictions": ["vegetarian", "vegan"],
                "allergens": ["sesame"]
            },
            {
                "id": 6,
                "name": "Apple with Almond Butter",
                "description": "Fresh apple slices with almond butter",
                "calories": 200,
                "protein": 5,
                "carbs": 25,
                "fat": 10,
                "fiber": 5,
                "meal_type": ["snack"],
                "ingredients": ["apple", "almond butter"],
                "instructions": "Slice apple and serve with almond butter.",
                "restrictions": ["vegetarian", "vegan"],
                "allergens": ["nuts"]
            },
            {
                "id": 7,
                "name": "Vegetable Stir-Fry with Tofu",
                "description": "Colorful vegetable stir-fry with tofu and brown rice",
                "calories": 400,
                "protein": 20,
                "carbs": 50,
                "fat": 15,
                "fiber": 8,
                "meal_type": ["lunch", "dinner"],
                "ingredients": ["tofu", "broccoli", "carrots", "bell peppers", "snap peas", "brown rice", "soy sauce", "ginger"],
                "instructions": "Stir-fry tofu and vegetables with ginger and soy sauce. Serve over brown rice.",
                "restrictions": ["vegetarian", "vegan"],
                "allergens": ["soy"]
            },
            {
                "id": 8,
                "name": "Protein Smoothie",
                "description": "Protein-packed smoothie with banana, berries, and protein powder",
                "calories": 300,
                "protein": 25,
                "carbs": 35,
                "fat": 5,
                "fiber": 6,
                "meal_type": ["breakfast", "snack"],
                "ingredients": ["banana", "mixed berries", "protein powder", "almond milk", "spinach"],
                "instructions": "Blend all ingredients until smooth.",
                "restrictions": [],
                "allergens": ["dairy"]
            },
            {
                "id": 9,
                "name": "Turkey and Avocado Wrap",
                "description": "Whole grain wrap with turkey, avocado, and vegetables",
                "calories": 450,
                "protein": 30,
                "carbs": 40,
                "fat": 20,
                "fiber": 8,
                "meal_type": ["lunch"],
                "ingredients": ["whole grain wrap", "turkey breast", "avocado", "lettuce", "tomato", "mustard"],
                "instructions": "Layer ingredients on wrap and roll up.",
                "restrictions": [],
                "allergens": ["gluten"]
            },
            {
                "id": 10,
                "name": "Baked Sweet Potato with Black Beans",
                "description": "Baked sweet potato topped with black beans, salsa, and Greek yogurt",
                "calories": 350,
                "protein": 15,
                "carbs": 60,
                "fat": 5,
                "fiber": 12,
                "meal_type": ["lunch", "dinner"],
                "ingredients": ["sweet potato", "black beans", "salsa", "Greek yogurt", "cilantro", "lime"],
                "instructions": "Bake sweet potato. Top with black beans, salsa, yogurt, cilantro, and lime juice.",
                "restrictions": ["vegetarian"],
                "allergens": ["dairy"]
            }
        ]
        
        with open('data/food_database.json', 'w') as f:
            json.dump(sample_foods, f, indent=2)
    
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
