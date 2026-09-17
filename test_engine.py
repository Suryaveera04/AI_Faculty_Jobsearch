"""
AcadeXMatch AI & Web Scraper Test Suite
"""

import sys
from scraper import (
    is_faculty_requirement,
    extract_faculty_details,
    score_link,
)

def run_tests():
    print("==================================================")
    print("🧪 Running AcadeXMatch AI & Scraper Test Suite")
    print("==================================================")

    # 1. Faculty Keyword Filter Tests
    print("\n[TEST 1] Testing Faculty Filter Classification...")
    test_cases = [
        ("Assistant Professor (Computer Science)", True),
        ("Associate Professor in ECE", True),
        ("Dean - School of Computing", True),
        ("Professor (Level 14 - 7th CPC)", True),
        ("Postdoctoral Research Fellow", True),
        ("Senior Assistant Professor", True),
        ("Driver / Attendant Grade IV", False),
        ("Bus Conductor", False),
        ("Faculty Development Programme on AI", False),
        ("Apply Online", False),
        ("Campus Life & Hostel Facilities", False),
        ("Electrician / Plumber Maintenance", False),
    ]

    for title, expected in test_cases:
        actual = is_faculty_requirement(title)
        assert actual == expected, f"Failed on '{title}': expected {expected}, got {actual}"
    print(f"✅ Passed: {len(test_cases)}/{len(test_cases)} faculty classification tests passed.")

    # 2. Structured Detail Extraction Tests
    print("\n[TEST 2] Testing Detail Extraction Heuristics...")
    sample_text = """
    Qualifications: Ph.D. in Computer Science and Engineering with First Class at UG and PG.
    Experience: Minimum 10 years of post-doctoral teaching and research experience.
    Salary: AICTE Pay scale Level 14 with 50% DA and standard allowances.
    Department: Department of Computer Science and Engineering.
    Last Date: 31/12/2026.
    """
    details = extract_faculty_details("Professor of Computer Science", sample_text)
    assert details["qualification"] and "ph.d" in details["qualification"].lower(), f"Qualification error: {details}"
    assert details["experience"] and "10" in details["experience"], f"Experience error: {details}"
    assert details["pay_level"] or details["salary"], f"Pay scale error: {details}"
    assert details["department"] and "Computer Science" in details["department"], f"Department error: {details}"
    assert details["deadline"] == "31/12/2026", f"Deadline error: {details}"
    print("✅ Passed: Qualifications, Experience, Pay Scale, Department, and Deadline extracted accurately.")

    # 3. Priority Link Scoring Tests
    print("\n[TEST 3] Testing Link Priority Scoring...")
    high_score = score_link("https://college.edu/faculty-recruitment", "Faculty Recruitment Openings", "https://college.edu")
    assert high_score > 100, f"Expected high score > 100, got {high_score}"

    career_score = score_link("https://college.edu/careers", "Careers", "https://college.edu")
    assert career_score > 0, f"Expected career score > 0, got {career_score}"

    discard_score = score_link("https://college.edu/login.php", "Student Login", "https://college.edu")
    assert discard_score < 0, f"Expected discard score < 0, got {discard_score}"
    print("✅ Passed: Career hubs prioritised and administrative links discarded.")

    print("\n==================================================")
    print("🎉 ALL TESTS PASSED SUCCESSFULLY! EVERYTHING WORKING PROPERLY.")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
