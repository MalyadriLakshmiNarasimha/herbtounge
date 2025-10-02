import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time

class LoginPageTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Run headless Chrome for testing
        cls.driver = webdriver.Chrome(options=chrome_options)
        cls.driver.implicitly_wait(5)
        cls.base_url = "http://localhost:3004"

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def test_login_page_loads(self):
        self.driver.get(f"{self.base_url}/login")
        self.assertIn("HerbalAuth", self.driver.page_source)
        self.assertIn("Welcome Back", self.driver.page_source)

    def test_login_with_valid_credentials(self):
        self.driver.get(f"{self.base_url}/login")
        email_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='email']")
        password_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        email_input.send_keys("admin@herbalauth.com")
        password_input.send_keys("Admin@123")
        sign_in_button = self.driver.find_element(By.XPATH, "//button[text()='Sign In']")
        sign_in_button.click()
        time.sleep(3)  # Wait for redirect
        self.assertIn("/dashboard", self.driver.current_url)

    def test_demo_login_button(self):
        self.driver.get(f"{self.base_url}/login")
        demo_login_button = self.driver.find_element(By.XPATH, "//button[text()='Demo Login']")
        demo_login_button.click()
        email_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='email']")
        password_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        self.assertEqual(email_input.get_attribute("value"), "admin@herbalauth.com")
        self.assertEqual(password_input.get_attribute("value"), "Admin@123")

    def test_forgot_password_link(self):
        self.driver.get(f"{self.base_url}/login")
        forgot_password_link = self.driver.find_element(By.LINK_TEXT, "Forgot password?")
        self.assertTrue(forgot_password_link.is_displayed())

if __name__ == "__main__":
    unittest.main()
