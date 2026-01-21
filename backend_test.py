import requests
import sys
import json
from datetime import datetime

class SheHuMaanAPITester:
    def __init__(self, base_url="https://shehumaan.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test_name": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{status} - {name}")
        if details:
            print(f"   Details: {details}")

    def test_root_endpoint(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                expected_message = "SheHuMaan API - Supporting Women in IT"
                if data.get("message") == expected_message:
                    self.log_test("Root Endpoint", True, f"Status: {response.status_code}, Message: {data.get('message')}")
                else:
                    self.log_test("Root Endpoint", False, f"Unexpected message: {data.get('message')}")
            else:
                self.log_test("Root Endpoint", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Root Endpoint", False, f"Error: {str(e)}")

    def test_resources_endpoint(self):
        """Test resources endpoint"""
        try:
            response = requests.get(f"{self.api_url}/resources", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                required_categories = ["emergency", "workplace", "mental_health", "legal"]
                has_all_categories = all(cat in data for cat in required_categories)
                
                if has_all_categories:
                    self.log_test("Resources Endpoint", True, f"All categories present: {list(data.keys())}")
                else:
                    missing = [cat for cat in required_categories if cat not in data]
                    self.log_test("Resources Endpoint", False, f"Missing categories: {missing}")
            else:
                self.log_test("Resources Endpoint", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Resources Endpoint", False, f"Error: {str(e)}")

    def create_sample_questionnaire(self):
        """Create sample questionnaire data for testing"""
        return {
            "work_hours_per_day": 10,
            "sleep_hours": 6.5,
            "work_from_home": True,
            "commute_time_minutes": 45,
            "night_shifts": False,
            "flexible_hours": True,
            "workload_level": 8,
            "deadline_pressure": 7,
            "manager_support": 4,
            "team_support": 6,
            "career_growth": 5,
            "work_life_balance": 3,
            "stress_level": 8,
            "anxiety_frequency": "often",
            "burnout_feeling": "moderate",
            "physical_symptoms": ["headache", "fatigue", "insomnia"],
            "family_responsibilities": "high",
            "social_support": "fair",
            "hobbies_time": "rare",
            "exercise_frequency": "1-2/week",
            "workplace_bias_experienced": True,
            "posh_awareness": True,
            "safety_concerns": "moderate",
            "age_group": "25-30",
            "years_in_it": 4,
            "current_role": "Software Engineer",
            "city": "Bangalore"
        }

    def test_assessment_analyze(self):
        """Test the main assessment analysis endpoint"""
        try:
            questionnaire = self.create_sample_questionnaire()
            
            print("🔍 Testing Assessment Analysis (this may take 10-15 seconds for AI generation)...")
            response = requests.post(
                f"{self.api_url}/assessment/analyze", 
                json=questionnaire,
                timeout=30,
                headers={'Content-Type': 'application/json'}
            )
            
            success = response.status_code == 200
            
            if success:
                data = response.json()
                
                # Check required fields in response
                required_fields = [
                    'id', 'stress_level', 'stress_score', 'burnout_risk', 'burnout_score',
                    'safety_risk', 'key_stressors', 'quick_summary', 'explanation',
                    'daily_plan', 'flex_suggestions', 'email_to_manager', 'email_to_hr',
                    'safety_tips', 'resources', 'warnings'
                ]
                
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    # Validate specific data types and content
                    validation_results = []
                    
                    # Check stress/burnout scores are numbers
                    if isinstance(data.get('stress_score'), int) and 0 <= data.get('stress_score') <= 100:
                        validation_results.append("✓ Stress score valid")
                    else:
                        validation_results.append("✗ Stress score invalid")
                    
                    if isinstance(data.get('burnout_score'), int) and 0 <= data.get('burnout_score') <= 100:
                        validation_results.append("✓ Burnout score valid")
                    else:
                        validation_results.append("✗ Burnout score invalid")
                    
                    # Check daily plan has 7 days
                    if isinstance(data.get('daily_plan'), list) and len(data.get('daily_plan')) == 7:
                        validation_results.append("✓ Daily plan has 7 days")
                    else:
                        validation_results.append(f"✗ Daily plan has {len(data.get('daily_plan', []))} days")
                    
                    # Check AI-generated content is not empty
                    if data.get('explanation') and len(data.get('explanation', '').strip()) > 50:
                        validation_results.append("✓ AI explanation generated")
                    else:
                        validation_results.append("✗ AI explanation missing/short")
                    
                    if data.get('email_to_manager') and len(data.get('email_to_manager', '').strip()) > 50:
                        validation_results.append("✓ Manager email generated")
                    else:
                        validation_results.append("✗ Manager email missing/short")
                    
                    # Check resources include India-specific helplines
                    resources = data.get('resources', [])
                    has_women_helpline = any('181' in str(r.get('contact', '')) for r in resources)
                    has_ncw = any('NCW' in str(r.get('title', '')) for r in resources)
                    
                    if has_women_helpline and has_ncw:
                        validation_results.append("✓ India-specific resources included")
                    else:
                        validation_results.append("✗ Missing India-specific resources")
                    
                    all_valid = all('✓' in result for result in validation_results)
                    details = f"Response validation: {'; '.join(validation_results)}"
                    
                    self.log_test("Assessment Analysis", all_valid, details)
                    
                    # Store sample result for frontend testing
                    with open('/tmp/sample_assessment_result.json', 'w') as f:
                        json.dump(data, f, indent=2)
                    
                else:
                    self.log_test("Assessment Analysis", False, f"Missing fields: {missing_fields}")
            else:
                error_text = ""
                try:
                    error_data = response.json()
                    error_text = error_data.get('detail', 'Unknown error')
                except:
                    error_text = response.text[:200]
                
                self.log_test("Assessment Analysis", False, f"Status: {response.status_code}, Error: {error_text}")
                
        except requests.exceptions.Timeout:
            self.log_test("Assessment Analysis", False, "Request timeout (>30s) - AI generation may be slow")
        except Exception as e:
            self.log_test("Assessment Analysis", False, f"Error: {str(e)}")

    def test_invalid_assessment_data(self):
        """Test assessment endpoint with invalid data"""
        try:
            # Missing required fields
            invalid_data = {"work_hours_per_day": 8}
            
            response = requests.post(
                f"{self.api_url}/assessment/analyze", 
                json=invalid_data,
                timeout=10,
                headers={'Content-Type': 'application/json'}
            )
            
            # Should return 422 for validation error
            success = response.status_code == 422
            
            if success:
                self.log_test("Invalid Assessment Data", True, f"Correctly rejected invalid data with status {response.status_code}")
            else:
                self.log_test("Invalid Assessment Data", False, f"Unexpected status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Invalid Assessment Data", False, f"Error: {str(e)}")

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting SheHuMaan API Tests")
        print("=" * 50)
        
        # Test basic endpoints
        self.test_root_endpoint()
        self.test_resources_endpoint()
        
        # Test main functionality
        self.test_assessment_analyze()
        self.test_invalid_assessment_data()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("⚠️  Some tests failed. Check details above.")
            return 1

def main():
    tester = SheHuMaanAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())