# Contributing to NutriBot

Thank you for your interest in contributing to NutriBot! This document provides guidelines and instructions for contributing.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Testing](#testing)

## Code of Conduct

By participating in this project, you agree to:
- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

1. **Fork the Repository**
   - Visit the [NutriBot repository](https://github.com/Tahleel1611/Nutri-Bot)
   - Click the "Fork" button in the top right

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Nutri-Bot.git
   cd Nutri-Bot
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/Tahleel1611/Nutri-Bot.git
   ```

## Development Setup

1. **Install Dependencies**
   ```bash
   ./setup.sh
   ```
   Or manually:
   ```bash
   npm install
   pip3 install -r requirements.txt
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Update database credentials and other settings

3. **Set Up Database**
   ```sql
   CREATE DATABASE nutribot;
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1: Node.js API
   npm run dev

   # Terminal 2: Python AI Service
   python3 app.py

   # Terminal 3: Frontend (if applicable)
   npm run dev
   ```

## Making Changes

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
   
   Use prefixes:
   - `feature/` for new features
   - `fix/` for bug fixes
   - `docs/` for documentation
   - `refactor/` for code refactoring
   - `test/` for adding tests

2. **Make Your Changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation as needed

3. **Test Your Changes**
   - Ensure all existing tests pass
   - Add new tests for new features
   - Test manually in the application

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Brief description of changes"
   ```
   
   Commit message format:
   ```
   type: Brief description (50 chars max)
   
   Detailed explanation if needed.
   - Bullet points for multiple changes
   - Reference issues: Fixes #123
   ```

## Submitting Changes

1. **Update Your Fork**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template with:
     - Description of changes
     - Related issues
     - Testing performed
     - Screenshots (if UI changes)

4. **PR Review Process**
   - Maintainers will review your PR
   - Address any requested changes
   - Once approved, your PR will be merged

## Coding Standards

### JavaScript/Node.js
- Use ES6+ features
- Use async/await over callbacks
- Use meaningful variable names
- Add JSDoc comments for functions
- Keep functions small and focused
- Handle errors properly

Example:
```javascript
/**
 * Get user profile by ID
 * @param {string} userId - The user's UUID
 * @returns {Promise<Object>} User profile object
 * @throws {Error} If user not found
 */
async function getUserProfile(userId) {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}
```

### Python
- Follow PEP 8 style guide
- Use type hints where appropriate
- Write docstrings for functions
- Use meaningful variable names
- Keep functions focused

Example:
```python
def calculate_bmr(weight: float, height: float, age: int, gender: str) -> float:
    """
    Calculate Basal Metabolic Rate using Harris-Benedict equation.
    
    Args:
        weight: Weight in kilograms
        height: Height in centimeters
        age: Age in years
        gender: 'male' or 'female'
        
    Returns:
        BMR in calories per day
        
    Raises:
        ValueError: If invalid gender specified
    """
    if gender == 'male':
        return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    elif gender == 'female':
        return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
    else:
        raise ValueError(f"Invalid gender: {gender}")
```

### Database
- Use migrations for schema changes
- Add appropriate indexes
- Use transactions for related operations
- Validate data before inserting
- Use UUIDs for primary keys

### API Design
- Follow RESTful conventions
- Use proper HTTP methods and status codes
- Version your APIs (e.g., `/api/v1/`)
- Include pagination for lists
- Provide meaningful error messages
- Document all endpoints

## Testing

### Writing Tests
- Write unit tests for new functions
- Write integration tests for API endpoints
- Test edge cases and error conditions
- Aim for >80% code coverage

### Running Tests
```bash
# Node.js tests
npm test

# Python tests
python -m pytest

# Run with coverage
npm run test:coverage
pytest --cov
```

## Documentation

- Update README.md for major changes
- Update API_DOCUMENTATION.md for API changes
- Add inline comments for complex logic
- Keep documentation in sync with code

## Questions or Problems?

- Check existing issues and PRs
- Search documentation
- Ask in discussions
- Create a new issue with details

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to NutriBot! 🎉
