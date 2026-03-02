# WebdriverIO E2E Test Framework
# Automation Testing Exercise

This project contains end-to-end tests written using WebdriverIO for Automation Testing exercise

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (which includes npm)
- Chrome browser

## Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/chris12pannapara-hub/QA_UI_Automation.git
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd askuity_takehome_assessment
    ```

3.  **Install the dependencies:**
    ```bash
    npm install
    ```

## Running the Tests

To run the tests, execute the following command from the root of the project:

```bash
npm run wdio
```

This command will start the WebdriverIO test runner, which will execute the spec files located in the `src/specs` directory.

## 🔄 Environment Configuration
### For now there is only the baseurl https://askuity-takehome-assessment.vercel.app but we can add more and make it robust



## 📊 Test Coverage

### Core Test Scenarios required (1-11)
| #     | Test Case |

| 1     | Navigate to Shopping Application 
| 2-3   | Filter by Size and Verify Results 
| 4-5   | Add Items to Cart and Open Cart 
| 6     | Verify Initial Cart State 
| 7-8   | Update Quantity and Verify Updated State 
| 9     | Validate Pricing Logic 
| 10-11 | Clear Cart and Verify Empty State 

### Additional Test cases covering some of the edge cases (12-14)
| #  | Test Case |

| 12 | Verify cart badge shows correct count 
| 13 | Verify product prices are positive 
| 14 | Verify cart item names are displayed correctly