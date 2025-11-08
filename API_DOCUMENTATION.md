# NutriBot API Documentation

## Base URLs
- **Node.js API**: `http://localhost:5000/api`
- **Python AI Service**: `http://localhost:5001/api`

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

Or in the `x-access-token` header:
```
x-access-token: <token>
```

---

## Authentication Endpoints

### Register User
**POST** `/api/auth/signup`

Create a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "username": "johndoe",
    "email": "john@example.com"
  },
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
```

**Error Responses:**
- `400`: Missing fields, password mismatch, invalid email
- `500`: Server error

---

### Login User
**POST** `/api/auth/signin`

Authenticate user and receive tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  },
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
```

**Error Responses:**
- `400`: Missing credentials
- `404`: User not found
- `401`: Invalid password
- `403`: Account deactivated

---

### Refresh Token
**POST** `/api/auth/refreshtoken`

Get a new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh-token"
}
```

**Success Response (200):**
```json
{
  "accessToken": "new-jwt-token"
}
```

---

## User Endpoints

### Get User Profile
**GET** `/api/users/profile`

Get authenticated user's profile.

**Headers:** Requires authentication

**Success Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "username": "johndoe",
    "email": "john@example.com",
    "profile": {
      "age": 30,
      "gender": "male",
      "weight": 75,
      "height": 175,
      "activityLevel": "moderate",
      "goal": "weight_loss",
      "dietaryRestrictions": [],
      "allergies": []
    }
  }
}
```

---

### Update User Profile
**PUT** `/api/users/profile`

Update user's profile information.

**Headers:** Requires authentication

**Request Body:**
```json
{
  "age": 30,
  "gender": "male",
  "weight": 75,
  "height": 175,
  "activityLevel": "moderate",
  "goal": "weight_loss",
  "dietaryRestrictions": ["vegetarian"],
  "allergies": ["peanuts"]
}
```

**Valid Values:**
- `gender`: "male", "female", "other", "not_specified"
- `activityLevel`: "sedentary", "light", "moderate", "active", "very_active"
- `goal`: "weight_loss", "weight_gain", "maintenance", "muscle_gain"

**Success Response (200):**
```json
{
  "message": "Profile updated successfully",
  "profile": { ... }
}
```

---

### Update Password
**PUT** `/api/users/password`

Change user's password.

**Headers:** Requires authentication

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Password updated successfully"
}
```

---

## Meal Endpoints

### Get All Meals
**GET** `/api/meals?page=1&limit=10&search=chicken`

Get all meals for authenticated user with pagination.

**Headers:** Requires authentication

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by meal name

**Success Response (200):**
```json
{
  "meals": [
    {
      "id": "uuid",
      "name": "Grilled Chicken",
      "calories": 300,
      "protein": 40,
      "carbs": 10,
      "fat": 12,
      "type": "lunch"
    }
  ],
  "totalItems": 50,
  "totalPages": 5,
  "currentPage": 1
}
```

---

### Get Meal by ID
**GET** `/api/meals/:id`

Get a specific meal by ID.

**Headers:** Requires authentication

**Success Response (200):**
```json
{
  "meal": {
    "id": "uuid",
    "name": "Grilled Chicken",
    "description": "Healthy grilled chicken",
    "calories": 300,
    "protein": 40,
    "carbs": 10,
    "fat": 12,
    "fiber": 2,
    "type": "lunch",
    "ingredients": ["chicken", "spices"],
    "instructions": "Grill for 20 minutes"
  }
}
```

---

### Create Meal
**POST** `/api/meals`

Create a new meal.

**Headers:** Requires authentication

**Request Body:**
```json
{
  "name": "Grilled Chicken",
  "description": "Healthy grilled chicken",
  "calories": 300,
  "protein": 40,
  "carbs": 10,
  "fat": 12,
  "fiber": 2,
  "type": "lunch",
  "ingredients": ["chicken", "spices"],
  "instructions": "Grill for 20 minutes"
}
```

**Valid Values:**
- `type`: "breakfast", "lunch", "dinner", "snack", "other"

**Success Response (201):**
```json
{
  "message": "Meal created successfully",
  "meal": { ... }
}
```

---

### Update Meal
**PUT** `/api/meals/:id`

Update an existing meal.

**Headers:** Requires authentication

**Request Body:** Same as Create Meal (all fields optional)

**Success Response (200):**
```json
{
  "message": "Meal updated successfully",
  "meal": { ... }
}
```

---

### Delete Meal
**DELETE** `/api/meals/:id`

Delete a meal.

**Headers:** Requires authentication

**Success Response (200):**
```json
{
  "message": "Meal deleted successfully"
}
```

---

## Diet Plan Endpoints

### Get All Diet Plans
**GET** `/api/plans?page=1&limit=10`

Get all diet plans for authenticated user.

**Headers:** Requires authentication

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page

**Success Response (200):**
```json
{
  "plans": [
    {
      "id": "uuid",
      "name": "Weight Loss Plan",
      "goal": "weight_loss",
      "dailyCalories": 1800,
      "dailyProtein": 120,
      "dailyCarbs": 150,
      "dailyFat": 60,
      "duration": 7,
      "isActive": true
    }
  ],
  "totalItems": 5,
  "totalPages": 1,
  "currentPage": 1
}
```

---

### Get Diet Plan by ID
**GET** `/api/plans/:id`

Get a specific diet plan with meals.

**Headers:** Requires authentication

**Success Response (200):**
```json
{
  "plan": {
    "id": "uuid",
    "name": "Weight Loss Plan",
    "description": "7-day weight loss plan",
    "goal": "weight_loss",
    "dailyCalories": 1800,
    "meals": [ ... ]
  }
}
```

---

### Create Diet Plan
**POST** `/api/plans`

Create a new diet plan.

**Headers:** Requires authentication

**Request Body:**
```json
{
  "name": "Weight Loss Plan",
  "description": "Custom 7-day plan",
  "goal": "weight_loss",
  "dailyCalories": 1800,
  "dailyProtein": 120,
  "dailyCarbs": 150,
  "dailyFat": 60,
  "duration": 7,
  "isActive": true
}
```

**Success Response (201):**
```json
{
  "message": "Diet plan created successfully",
  "plan": { ... }
}
```

---

### Generate AI Diet Plan
**POST** `/api/plans/generate`

Generate an AI-powered diet plan based on user profile.

**Headers:** Requires authentication

**Request Body:**
```json
{
  "duration": 7
}
```

**Success Response (201):**
```json
{
  "message": "AI-generated diet plan created successfully",
  "plan": { ... },
  "aiData": {
    "days": [ ... ]
  }
}
```

**Error Responses:**
- `404`: User profile not found
- `503`: AI service unavailable

---

### Update Diet Plan
**PUT** `/api/plans/:id`

Update an existing diet plan.

**Headers:** Requires authentication

**Request Body:** Same as Create Diet Plan (all fields optional)

---

### Delete Diet Plan
**DELETE** `/api/plans/:id`

Delete a diet plan.

**Headers:** Requires authentication

**Success Response (200):**
```json
{
  "message": "Diet plan deleted successfully"
}
```

---

### Add Meal to Plan
**POST** `/api/plans/:id/meals/:mealId`

Add a meal to a diet plan.

**Headers:** Requires authentication

**Success Response (200):**
```json
{
  "message": "Meal added to diet plan successfully"
}
```

---

### Remove Meal from Plan
**DELETE** `/api/plans/:id/meals/:mealId`

Remove a meal from a diet plan.

**Headers:** Requires authentication

**Success Response (200):**
```json
{
  "message": "Meal removed from diet plan successfully"
}
```

---

## AI Service Endpoints

### Get Meal Recommendations
**POST** `/api/recommend/meals`

Get AI-powered meal recommendations based on user profile.

**Request Body:**
```json
{
  "profile": {
    "age": 30,
    "gender": "male",
    "weight": 75,
    "height": 175,
    "activityLevel": "moderate",
    "goal": "weight_loss",
    "dietaryRestrictions": ["vegetarian"],
    "allergies": ["peanuts"]
  }
}
```

**Success Response (200):**
```json
{
  "meal_plan": {
    "daily_calories": 1800,
    "daily_protein": 120,
    "daily_carbs": 150,
    "daily_fat": 60,
    "meals": {
      "breakfast": [ ... ],
      "lunch": [ ... ],
      "dinner": [ ... ],
      "snacks": [ ... ]
    }
  },
  "recommendations": {
    "goal": "weight_loss",
    "message": "Based on your weight_loss goal, we recommend consuming approximately 1800 calories per day."
  }
}
```

---

### Generate Complete Diet Plan
**POST** `/api/generate/diet-plan`

Generate a complete multi-day diet plan.

**Request Body:**
```json
{
  "profile": {
    "age": 30,
    "gender": "male",
    "weight": 75,
    "height": 175,
    "activityLevel": "moderate",
    "goal": "weight_loss"
  },
  "duration": 7
}
```

**Success Response (200):**
```json
{
  "diet_plan": {
    "name": "Weight Loss Plan",
    "description": "A 7-day personalized diet plan for weight loss",
    "goal": "weight_loss",
    "dailyCalories": 1800,
    "days": [
      {
        "day": 1,
        "meals": [ ... ]
      }
    ]
  },
  "message": "Successfully generated a 7-day diet plan for weight loss."
}
```

---

## Health Check Endpoints

### Node.js API Health
**GET** `/health`

Check if the Node.js API is running.

**Success Response (200):**
```json
{
  "status": "healthy",
  "service": "NutriBot API",
  "version": "1.0.0",
  "timestamp": "2023-11-08T12:00:00.000Z"
}
```

---

### Python AI Service Health
**GET** `/health`

Check if the Python AI service is running.

**Success Response (200):**
```json
{
  "status": "healthy",
  "service": "NutriBot AI Service",
  "version": "1.0.0"
}
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "message": "Error description",
  "error": "Additional error details (development only)"
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error
- `503`: Service Unavailable (external service down)
