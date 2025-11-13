from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import random
from dotenv import load_dotenv
import numpy as np
from datetime import datetime, timedelta
from collections import Counter
import itertools
from sklearn.metrics.pairwise import cosine_similarity

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize FOOD_DATABASE as empty, will be populated if file exists
FOOD_DATABASE = []

# Load food database if it exists
try:
    with open('data/food_database.json', 'r') as f:
        FOOD_DATABASE = json.load(f)
    print("Food database loaded successfully!")
except FileNotFoundError:
    print("Food database not found, will be created when server starts")
    FOOD_DATABASE = []

# Helper functions for advanced meal planning
def calculate_meal_similarity(recipe1, recipe2):
    """Calculate similarity between two recipes based on ingredients and nutritional values"""
    ingredients1 = set(recipe1.get('ingredients', []))
    ingredients2 = set(recipe2.get('ingredients', []))
    
    # Calculate ingredient overlap
    common_ingredients = ingredients1.intersection(ingredients2)
    ingredient_similarity = len(common_ingredients) / min(len(ingredients1), len(ingredients2))
    
    # Calculate nutritional similarity
    nutrients1 = [recipe1.get('protein', 0), recipe1.get('carbs', 0), recipe1.get('fat', 0)]
    nutrients2 = [recipe2.get('protein', 0), recipe2.get('carbs', 0), recipe2.get('fat', 0)]
    
    nutritional_similarity = cosine_similarity([nutrients1], [nutrients2])[0][0]
    
    return 0.7 * ingredient_similarity + 0.3 * nutritional_similarity

def get_meal_history(user_id):
    """Get user's meal history from database (simulated)"""
    # In a real app, this would query a database
    return [
        {'meal_id': 1, 'timestamp': datetime.now() - timedelta(days=3)},
        {'meal_id': 2, 'timestamp': datetime.now() - timedelta(days=4)},
        {'meal_id': 1, 'timestamp': datetime.now() - timedelta(days=7)},
        {'meal_id': 3, 'timestamp': datetime.now() - timedelta(days=10)}
    ]

def optimize_ingredients(meals, available_ingredients):
    """Optimize meal selection based on available ingredients"""
    optimized_meals = []
    for meal in meals:
        required_ingredients = set(meal.get('ingredients', []))
        available = required_ingredients.intersection(available_ingredients)
        if len(available) / len(required_ingredients) >= 0.7:  # 70% match threshold
            optimized_meals.append(meal)
    return optimized_meals

def customize_recipe(recipe, preferences):
    """Customize recipe based on user preferences"""
    if not preferences:
        return recipe
    
    customized = recipe.copy()
    
    # Adjust spiciness
    if 'spiciness' in preferences:
        if preferences['spiciness'] == 'less':
            customized['ingredients'] = [i for i in customized['ingredients'] if 'chili' not in i.lower()]
        elif preferences['spiciness'] == 'more':
            customized['ingredients'].extend(['chili flakes', 'cayenne pepper'])
    
    # Adjust cooking method
    if 'cooking_method' in preferences:
        customized['instructions'] = customized['instructions'].replace(
            'bake', preferences['cooking_method']
        ).replace(
            'grill', preferences['cooking_method']
        )
    
    return customized

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
    data = request.json
    
    # Get user's meal history for meal rotation
    user_id = data.get('userId')
    meal_history = get_meal_history(user_id)
    
    # Extract user information
    user_profile = data.get('profile', {})
    goal = user_profile.get('goal', 'maintenance')
    dietary_restrictions = user_profile.get('dietaryRestrictions', [])
    allergies = user_profile.get('allergies', [])
    
    # Get available ingredients for optimization
    available_ingredients = data.get('availableIngredients', [])
    
    # Get user preferences for recipe customization
    preferences = data.get('preferences', {})
    
    # Calculate daily calorie needs (simplified)
    weight = user_profile.get('weight', 70)  # kg
    height = user_profile.get('height', 170)  # cm
    age = user_profile.get('age', 30)
    gender = user_profile.get('gender', 'male')
    activity_level = user_profile.get('activityLevel', 'moderate')
    
    # Extract user information
    user_profile = data.get('profile', {})
    goal = user_profile.get('goal', 'maintenance')
    dietary_restrictions = user_profile.get('dietaryRestrictions', [])
    allergies = user_profile.get('allergies', [])
    
    # Calculate daily calorie needs (simplified)
    weight = user_profile.get('weight', 70)  # kg
    height = user_profile.get('height', 170)  # cm
    age = user_profile.get('age', 30)
    gender = user_profile.get('gender', 'male')
    activity_level = user_profile.get('activityLevel', 'moderate')
    
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
    
    for restriction in dietary_restrictions:
        filtered_foods = [food for food in filtered_foods if restriction.lower() not in food.get('restrictions', [])]
    
    for allergy in allergies:
        filtered_foods = [food for food in filtered_foods if allergy.lower() not in food.get('allergens', [])]
    
    # Optimize foods based on available ingredients
    optimized_foods = optimize_ingredients(filtered_foods, available_ingredients) if available_ingredients else filtered_foods
    
    # Generate meal suggestions with smart rotation
    meal_types = ['breakfast', 'lunch', 'dinner', 'snack']
    meal_plan = {
        'daily_calories': round(daily_calories),
        'daily_protein': round(daily_protein),
        'daily_carbs': round(daily_carbs),
        'daily_fat': round(daily_fat),
        'meals': {}
    }
    
    for meal_type in meal_types:
        # Get options for this meal type
        options = [food for food in optimized_foods if meal_type in food.get('meal_type', [])]
        
        # Apply smart rotation - avoid meals that are too similar to recent history
        if meal_history:
            recent_meals = [m['meal_id'] for m in meal_history if m['timestamp'] > datetime.now() - timedelta(days=7)]
            recent_meals = [f for f in FOOD_DATABASE if f['id'] in recent_meals]
            
            # Calculate similarity scores
            similarity_scores = []
            for option in options:
                max_similarity = 0
                for recent in recent_meals:
                    similarity = calculate_meal_similarity(option, recent)
                    if similarity > max_similarity:
                        max_similarity = similarity
                similarity_scores.append((option, max_similarity))
            
            # Sort by similarity (lowest first)
            similarity_scores.sort(key=lambda x: x[1])
            options = [x[0] for x in similarity_scores]
        
        # Select meal and customize based on preferences
        if options:
            selected_meal = options[0]  # Most different from recent meals
            customized_meal = customize_recipe(selected_meal, preferences)
            meal_plan['meals'][meal_type] = [customized_meal]
    
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
    data = request.json
    
    # Extract user information
    user_profile = data.get('profile', {})
    goal = user_profile.get('goal', 'maintenance')
    duration_days = data.get('duration', 7)  # Default to 7-day plan
    
    # Get meal recommendations first
    meal_response = recommend_meals()
    meal_data = json.loads(meal_response.get_data(as_text=True))
    
    # Create a diet plan
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

    # Generate meals for each day
    for day in range(1, duration_days + 1):
        # For variety, we'd normally generate different meals for each day
        # But for simplicity, we'll use the same recommendations with slight variations
        
        meals = meal_data['meal_plan']['meals']
        breakfast = meals.get('breakfast', [{}])[0] if meals.get('breakfast') else {'name': 'Basic Breakfast', 'calories': 300, 'protein': 10, 'carbs': 40, 'fat': 10, 'ingredients': ['oats', 'milk'], 'instructions': 'Cook oats with milk'}
        lunch = meals.get('lunch', [{}])[0] if meals.get('lunch') else {'name': 'Basic Lunch', 'calories': 400, 'protein': 20, 'carbs': 50, 'fat': 15, 'ingredients': ['bread', 'chicken'], 'instructions': 'Make sandwich'}
        dinner = meals.get('dinner', [{}])[0] if meals.get('dinner') else {'name': 'Basic Dinner', 'calories': 500, 'protein': 30, 'carbs': 40, 'fat': 20, 'ingredients': ['rice', 'vegetables'], 'instructions': 'Cook rice with vegetables'}
        snack1 = meals.get('snack', [{}])[0] if meals.get('snack') else {'name': 'Basic Snack', 'calories': 150, 'protein': 5, 'carbs': 20, 'fat': 5, 'ingredients': ['apple'], 'instructions': 'Eat apple'}
        snack2 = meals.get('snack', [{}])[0] if meals.get('snack') else {'name': 'Basic Snack 2', 'calories': 150, 'protein': 5, 'carbs': 20, 'fat': 5, 'ingredients': ['nuts'], 'instructions': 'Eat handful of nuts'}
        
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
                    'ingredients': breakfast['ingredients'],
                    'instructions': breakfast.get('instructions', 'No specific instructions.')
                },
                {
                    'type': 'lunch',
                    'name': lunch['name'],
                    'calories': round(lunch['calories'] * variation),
                    'protein': round(lunch['protein'] * variation, 1),
                    'carbs': round(lunch['carbs'] * variation, 1),
                    'fat': round(lunch['fat'] * variation, 1),
                    'ingredients': lunch['ingredients'],
                    'instructions': lunch.get('instructions', 'No specific instructions.')
                },
                {
                    'type': 'dinner',
                    'name': dinner['name'],
                    'calories': round(dinner['calories'] * variation),
                    'protein': round(dinner['protein'] * variation, 1),
                    'carbs': round(dinner['carbs'] * variation, 1),
                    'fat': round(dinner['fat'] * variation, 1),
                    'ingredients': dinner['ingredients'],
                    'instructions': dinner.get('instructions', 'No specific instructions.')
                },
                {
                    'type': 'snack',
                    'name': snack1['name'],
                    'calories': round(snack1['calories'] * variation),
                    'protein': round(snack1['protein'] * variation, 1),
                    'carbs': round(snack1['carbs'] * variation, 1),
                    'fat': round(snack1['fat'] * variation, 1),
                    'ingredients': snack1['ingredients'],
                    'instructions': snack1.get('instructions', 'No specific instructions.')
                },
                {
                    'type': 'snack',
                    'name': snack2['name'],
                    'calories': round(snack2['calories'] * variation),
                    'protein': round(snack2['protein'] * variation, 1),
                    'carbs': round(snack2['carbs'] * variation, 1),
                    'fat': round(snack2['fat'] * variation, 1),
                    'ingredients': snack2['ingredients'],
                    'instructions': snack2.get('instructions', 'No specific instructions.')
                }
            ]
        }
        
        diet_plan['days'].append(day_plan)
    
    return jsonify({
        'diet_plan': diet_plan,
        'message': f"Successfully generated a {duration_days}-day diet plan for {goal.replace('_', ' ')}."
    })

@app.route('/api/generate/meal-prep', methods=['POST'])
def generate_meal_prep():
    """
    Generate a meal prep plan with shopping list and prep instructions
    """
    data = request.json
    
    # Extract user information
    user_profile = data.get('profile', {})
    goal = user_profile.get('goal', 'maintenance')
    duration_days = data.get('duration', 7)  # Default to 7-day plan
    
    # Generate diet plan first
    diet_response = generate_diet_plan()
    diet_data = json.loads(diet_response.get_data(as_text=True))
    
    # Generate shopping list
    shopping_list = {}
    prep_instructions = []
    
    # Collect all ingredients
    for day in diet_data['diet_plan']['days']:
        for meal in day['meals']:
            for ingredient in meal['ingredients']:
                if ingredient not in shopping_list:
                    shopping_list[ingredient] = 1
                else:
                    shopping_list[ingredient] += 1
    
    # Generate prep instructions
    for day in diet_data['diet_plan']['days']:
        day_prep = []
        for meal in day['meals']:
            if meal['instructions'] and meal['instructions'] != 'No specific instructions.':
                day_prep.append({
                    'meal': meal['name'],
                    'instructions': meal['instructions']
                })
        if day_prep:
            prep_instructions.append({
                'day': day['day'],
                'preparation': day_prep
            })
    
    # Group similar prep tasks
    grouped_instructions = {}
    for instr in prep_instructions:
        for task in instr['preparation']:
            if task['instructions'] not in grouped_instructions:
                grouped_instructions[task['instructions']] = []
            grouped_instructions[task['instructions']].append(task['meal'])
    
    # Format final prep instructions
    final_prep_instructions = []
    for instr, meals in grouped_instructions.items():
        final_prep_instructions.append({
            'instructions': instr,
            'applies_to': ', '.join(meals)
        })
    
    # Generate meal prep plan
    meal_prep_plan = {
        'shopping_list': shopping_list,
        'prep_instructions': final_prep_instructions,
        'storage_instructions': [
            'Store cooked grains in airtight containers in the fridge',
            'Keep raw vegetables in the crisper drawer',
            'Store proteins in separate containers',
            'Keep dressings and sauces in the fridge'
        ],
        'meal_plan': diet_data['diet_plan']
    }
    
    return jsonify({
        'meal_prep_plan': meal_prep_plan,
        'message': f"Successfully generated a {duration_days}-day meal prep plan."
    })

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