import json
import os

# Create data directory if it doesn't exist
os.makedirs('data', exist_ok=True)

# Create food database if it doesn't exist
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
        }
    ]
    
    with open('data/food_database.json', 'w') as f:
        json.dump(sample_foods, f, indent=2)
    print('Sample food database created successfully!')
else:
    print('Food database already exists!')