import {UserOS} from "~/util/os";

export interface Episode {
  section: number;
  count: number;
  path: string;
  title: string;
}

const BaseDir = UserOS == "Windows" ? "S:/ReactNative Course/out_dir/react-native-mobile-app-development" : "/Volumes/SSD/react-native-mobile-app-development"

export const Course: Record<string, Episode[]> = {
  "01 - Getting Started": [
    {
      "section": 0,
      "count": 0,
      "path": `${BaseDir}/01 - Getting Started/001 Welcome to This Course & What to Expect.mp4`,
      "title": "001 Welcome to This Course & What to Expect"
    },
    {
      "section": 0,
      "count": 1,
      "path": `${BaseDir}/01 - Getting Started/002 What is React Native.mp4`,
      "title": "002 What is React Native"
    },
    {
      "section": 0,
      "count": 2,
      "path": `${BaseDir}/01 - Getting Started/004 React Native CLI vs Expo.mp4`,
      "title": "004 React Native CLI vs Expo"
    }
  ],
  "02 - Getting Started on macOS": [
    {
      "section": 1,
      "count": 0,
      "path": `${BaseDir}/02 - Getting Started on macOS/001 (macOS) How to Setup Local Development Environment for iOS React Native Apps.mp4`,
      "title": "001 (macOS) How to Setup Local Development Environment for iOS React Native Apps"
    },
    {
      "section": 1,
      "count": 1,
      "path": `${BaseDir}/02 - Getting Started on macOS/002 (macOS) How to Setup Local Development Environment for Android React Native Apps.mp4`,
      "title": "002 (macOS) How to Setup Local Development Environment for Android React Native Apps"
    }
  ],
  "03 - Getting Started on Windows": [
    {
      "section": 2,
      "count": 0,
      "path": `${BaseDir}/03 - Getting Started on Windows/001 (Windows) How to Setup Local Development Environment for Android.mp4`,
      "title": "001 (Windows) How to Setup Local Development Environment for Android"
    },
    {
      "section": 2,
      "count": 1,
      "path": `${BaseDir}/03 - Getting Started on Windows/002 Important - Please watch till the end.mp4`,
      "title": "002 Important - Please watch till the end"
    }
  ],
  "04 - Creating the First App": [
    {
      "section": 3,
      "count": 0,
      "path": `${BaseDir}/04 - Creating the First App/001 What is a Code Editor, ESLint & Prettier (Optional).mp4`,
      "title": "001 What is a Code Editor, ESLint & Prettier (Optional)"
    },
    {
      "section": 3,
      "count": 1,
      "path": `${BaseDir}/04 - Creating the First App/003 What is JSX (Optional).mp4`,
      "title": "003 What is JSX (Optional)"
    },
    {
      "section": 3,
      "count": 2,
      "path": `${BaseDir}/04 - Creating the First App/005 Let's Create Hello World App!.mp4`,
      "title": "005 Let's Create Hello World App!"
    },
    {
      "section": 3,
      "count": 3,
      "path": `${BaseDir}/04 - Creating the First App/006 Hello World App - Detailed Overview.mp4`,
      "title": "006 Hello World App - Detailed Overview"
    }
  ],
  "05 - [Extra] Javascript Refresher (Optional)": [
    {
      "section": 4,
      "count": 0,
      "path": `${BaseDir}/05 - [Extra] Javascript Refresher (Optional)/001 Introduction.mp4`,
      "title": "001 Introduction"
    },
    {
      "section": 4,
      "count": 1,
      "path": `${BaseDir}/05 - [Extra] Javascript Refresher (Optional)/002 Little Bit About JavaScript.mp4`,
      "title": "002 Little Bit About JavaScript"
    },
    {
      "section": 4,
      "count": 2,
      "path": `${BaseDir}/05 - [Extra] Javascript Refresher (Optional)/003 Syntax Refresher.mp4`,
      "title": "003 Syntax Refresher"
    },
    {
      "section": 4,
      "count": 3,
      "path": `${BaseDir}/05 - [Extra] Javascript Refresher (Optional)/005 Let & Const Variables.mp4`,
      "title": "005 Let & Const Variables"
    },
    {
      "section": 4,
      "count": 4,
      "path": `${BaseDir}/05 - [Extra] Javascript Refresher (Optional)/007 Arrow Functions.mp4`,
      "title": "007 Arrow Functions"
    },
    {
      "section": 4,
      "count": 5,
      "path": `${BaseDir}/05 - [Extra] Javascript Refresher (Optional)/009 Objects Properties & Methods.mp4`,
      "title": "009 Objects Properties & Methods"
    },
    {
      "section": 4,
      "count": 6,
      "path": `${BaseDir}/05 - [Extra] Javascript Refresher (Optional)/011 Array & Array Methods.mp4`,
      "title": "011 Array & Array Methods"
    },
    {
      "section": 4,
      "count": 7,
      "path": `${BaseDir}/05 - [Extra] Javascript Refresher (Optional)/013 Arrays, Objects & Reference Types.mp4`,
      "title": "013 Arrays, Objects & Reference Types"
    },
    {
      "section": 4,
      "count": 8,
      "path": `${BaseDir}/05 - [Extra] Javascript Refresher (Optional)/015 Spread Operator & Rest Operators.mp4`,
      "title": "015 Spread Operator & Rest Operators"
    },
    {
      "section": 4,
      "count": 9,
      "path": `${BaseDir}/05 - [Extra] Javascript Refresher (Optional)/017 Destructuring.mp4`,
      "title": "017 Destructuring"
    },
    {
      "section": 4,
      "count": 10,
      "path": `${BaseDir}/05 - [Extra] Javascript Refresher (Optional)/020 Async, Await & Promises - Working with APIs.mp4`,
      "title": "020 Async, Await & Promises - Working with APIs"
    },
    {
      "section": 4,
      "count": 11,
      "path": `${BaseDir}/05 - [Extra] Javascript Refresher (Optional)/022 Summary.mp4`,
      "title": "022 Summary"
    }
  ],
  "06 - [Extra] Styling (Optional - Made for complete beginners)": [
    {
      "section": 5,
      "count": 0,
      "path": `${BaseDir}/06 - [Extra] Styling (Optional - Made for complete beginners)/001 Introduction.mp4`,
      "title": "001 Introduction"
    },
    {
      "section": 5,
      "count": 1,
      "path": `${BaseDir}/06 - [Extra] Styling (Optional - Made for complete beginners)/002 Borders.mp4`,
      "title": "002 Borders"
    },
    {
      "section": 5,
      "count": 2,
      "path": `${BaseDir}/06 - [Extra] Styling (Optional - Made for complete beginners)/004 Margins.mp4`,
      "title": "004 Margins"
    },
    {
      "section": 5,
      "count": 3,
      "path": `${BaseDir}/06 - [Extra] Styling (Optional - Made for complete beginners)/006 Paddings.mp4`,
      "title": "006 Paddings"
    },
    {
      "section": 5,
      "count": 4,
      "path": `${BaseDir}/06 - [Extra] Styling (Optional - Made for complete beginners)/008 Position Absolute & Relative & zIndex.mp4`,
      "title": "008 Position Absolute & Relative & zIndex"
    },
    {
      "section": 5,
      "count": 5,
      "path": `${BaseDir}/06 - [Extra] Styling (Optional - Made for complete beginners)/010 Text Styles.mp4`,
      "title": "010 Text Styles"
    },
    {
      "section": 5,
      "count": 6,
      "path": `${BaseDir}/06 - [Extra] Styling (Optional - Made for complete beginners)/012 Summary.mp4`,
      "title": "012 Summary"
    }
  ],
  "07 - React & React Native Basics": [
    {
      "section": 6,
      "count": 0,
      "path": `${BaseDir}/07 - React & React Native Basics/001 Introduction.mp4`,
      "title": "001 Introduction"
    },
    {
      "section": 6,
      "count": 1,
      "path": `${BaseDir}/07 - React & React Native Basics/002 What is a Component.mp4`,
      "title": "002 What is a Component"
    },
    {
      "section": 6,
      "count": 2,
      "path": `${BaseDir}/07 - React & React Native Basics/004 What are Stylesheets.mp4`,
      "title": "004 What are Stylesheets"
    },
    {
      "section": 6,
      "count": 3,
      "path": `${BaseDir}/07 - React & React Native Basics/006 View Component.mp4`,
      "title": "006 View Component"
    },
    {
      "section": 6,
      "count": 4,
      "path": `${BaseDir}/07 - React & React Native Basics/008 What are Props & Prop Types.mp4`,
      "title": "008 What are Props & Prop Types"
    },
    {
      "section": 6,
      "count": 5,
      "path": `${BaseDir}/07 - React & React Native Basics/010 Event Handling.mp4`,
      "title": "010 Event Handling"
    },
    {
      "section": 6,
      "count": 6,
      "path": `${BaseDir}/07 - React & React Native Basics/012 Summary.mp4`,
      "title": "012 Summary"
    }
  ],
  "08 - [Extra] Deep Dive into React Hooks (Optional - Only for React beginners)": [
    {
      "section": 7,
      "count": 0,
      "path": `${BaseDir}/08 - [Extra] Deep Dive into React Hooks (Optional - Only for React beginners)/001 Introduction.mp4`,
      "title": "001 Introduction"
    },
    {
      "section": 7,
      "count": 1,
      "path": `${BaseDir}/08 - [Extra] Deep Dive into React Hooks (Optional - Only for React beginners)/002 What are React Hooks.mp4`,
      "title": "002 What are React Hooks"
    },
    {
      "section": 7,
      "count": 2,
      "path": `${BaseDir}/08 - [Extra] Deep Dive into React Hooks (Optional - Only for React beginners)/004 Getting Started with useState.mp4`,
      "title": "004 Getting Started with useState"
    },
    {
      "section": 7,
      "count": 3,
      "path": `${BaseDir}/08 - [Extra] Deep Dive into React Hooks (Optional - Only for React beginners)/006 Understanding useEffect.mp4`,
      "title": "006 Understanding useEffect"
    },
    {
      "section": 7,
      "count": 4,
      "path": `${BaseDir}/08 - [Extra] Deep Dive into React Hooks (Optional - Only for React beginners)/008 Working with refs and useRef.mp4`,
      "title": "008 Working with refs and useRef"
    },
    {
      "section": 7,
      "count": 5,
      "path": `${BaseDir}/08 - [Extra] Deep Dive into React Hooks (Optional - Only for React beginners)/010 Working with useContext.mp4`,
      "title": "010 Working with useContext"
    },
    {
      "section": 7,
      "count": 6,
      "path": `${BaseDir}/08 - [Extra] Deep Dive into React Hooks (Optional - Only for React beginners)/012 Creating Custom Hooks.mp4`,
      "title": "012 Creating Custom Hooks"
    },
    {
      "section": 7,
      "count": 7,
      "path": `${BaseDir}/08 - [Extra] Deep Dive into React Hooks (Optional - Only for React beginners)/014 Summary.mp4`,
      "title": "014 Summary"
    }
  ],
  "09 - [Extra] Deep Dive into Class Based Components (Only for React Beginners)": [
    {
      "section": 8,
      "count": 0,
      "path": `${BaseDir}/09 - [Extra] Deep Dive into Class Based Components (Only for React Beginners)/001 Introduction.mp4`,
      "title": "001 Introduction"
    },
    {
      "section": 8,
      "count": 1,
      "path": `${BaseDir}/09 - [Extra] Deep Dive into Class Based Components (Only for React Beginners)/002 What is a Class Based Component.mp4`,
      "title": "002 What is a Class Based Component"
    },
    {
      "section": 8,
      "count": 2,
      "path": `${BaseDir}/09 - [Extra] Deep Dive into Class Based Components (Only for React Beginners)/004 Working with State & Events.mp4`,
      "title": "004 Working with State & Events"
    },
    {
      "section": 8,
      "count": 3,
      "path": `${BaseDir}/09 - [Extra] Deep Dive into Class Based Components (Only for React Beginners)/006 Component Lifecycle Methods in Action.mp4`,
      "title": "006 Component Lifecycle Methods in Action"
    },
    {
      "section": 8,
      "count": 4,
      "path": `${BaseDir}/09 - [Extra] Deep Dive into Class Based Components (Only for React Beginners)/008 Functional Components with Hooks VS Class Based Components with Lifecycle.mp4`,
      "title": "008 Functional Components with Hooks VS Class Based Components with Lifecycle"
    },
    {
      "section": 8,
      "count": 5,
      "path": `${BaseDir}/09 - [Extra] Deep Dive into Class Based Components (Only for React Beginners)/010 Summary.mp4`,
      "title": "010 Summary"
    }
  ],
  "10 - Building Basic Components": [
    {
      "section": 9,
      "count": 0,
      "path": `${BaseDir}/10 - Building Basic Components/001 Introduction.mp4`,
      "title": "001 Introduction"
    },
    {
      "section": 9,
      "count": 1,
      "path": `${BaseDir}/10 - Building Basic Components/003 Image Component.mp4`,
      "title": "003 Image Component"
    },
    {
      "section": 9,
      "count": 2,
      "path": `${BaseDir}/10 - Building Basic Components/005 Text Input Component.mp4`,
      "title": "005 Text Input Component"
    },
    {
      "section": 9,
      "count": 3,
      "path": `${BaseDir}/10 - Building Basic Components/008 ScrollView Component.mp4`,
      "title": "008 ScrollView Component"
    },
    {
      "section": 9,
      "count": 4,
      "path": `${BaseDir}/10 - Building Basic Components/010 Button Component & Form Submission.mp4`,
      "title": "010 Button Component & Form Submission"
    },
    {
      "section": 9,
      "count": 5,
      "path": `${BaseDir}/10 - Building Basic Components/012 Switch Component.mp4`,
      "title": "012 Switch Component"
    },
    {
      "section": 9,
      "count": 6,
      "path": `${BaseDir}/10 - Building Basic Components/014 Icons with FontAwesome.mp4`,
      "title": "014 Icons with FontAwesome"
    },
    {
      "section": 9,
      "count": 7,
      "path": `${BaseDir}/10 - Building Basic Components/015 Deep Dive in Flexbox.mp4`,
      "title": "015 Deep Dive in Flexbox"
    },
    {
      "section": 9,
      "count": 8,
      "path": `${BaseDir}/10 - Building Basic Components/017 Summary.mp4`,
      "title": "017 Summary"
    }
  ],
  "11 - Figma Design Resources (Optional)": [
    {
      "section": 10,
      "count": 0,
      "path": `${BaseDir}/11 - Figma Design Resources (Optional)/001 What is Figma.mp4`,
      "title": "001 What is Figma"
    },
    {
      "section": 10,
      "count": 1,
      "path": `${BaseDir}/11 - Figma Design Resources (Optional)/002 Figma Tutorial for our Upcoming Projects.mp4`,
      "title": "002 Figma Tutorial for our Upcoming Projects"
    }
  ],
  "12 - [Practice] Getting Started on Social Media App": [
    {
      "section": 11,
      "count": 0,
      "path": `${BaseDir}/12 - [Practice] Getting Started on Social Media App/001 Social Media Feed Application Introduction.mp4`,
      "title": "001 Social Media Feed Application Introduction"
    },
    {
      "section": 11,
      "count": 1,
      "path": `${BaseDir}/12 - [Practice] Getting Started on Social Media App/002 Installing a New Application.mp4`,
      "title": "002 Installing a New Application"
    },
    {
      "section": 11,
      "count": 2,
      "path": `${BaseDir}/12 - [Practice] Getting Started on Social Media App/003 How to Install Custom Fonts.mp4`,
      "title": "003 How to Install Custom Fonts"
    },
    {
      "section": 11,
      "count": 3,
      "path": `${BaseDir}/12 - [Practice] Getting Started on Social Media App/005 Creating a Title Component.mp4`,
      "title": "005 Creating a Title Component"
    },
    {
      "section": 11,
      "count": 4,
      "path": `${BaseDir}/12 - [Practice] Getting Started on Social Media App/006 Installing FontAwesome Icons.mp4`,
      "title": "006 Installing FontAwesome Icons"
    },
    {
      "section": 11,
      "count": 5,
      "path": `${BaseDir}/12 - [Practice] Getting Started on Social Media App/007 What is a Flatlist.mp4`,
      "title": "007 What is a Flatlist"
    },
    {
      "section": 11,
      "count": 6,
      "path": `${BaseDir}/12 - [Practice] Getting Started on Social Media App/009 Setting Up For Flatlist.mp4`,
      "title": "009 Setting Up For Flatlist"
    },
    {
      "section": 11,
      "count": 7,
      "path": `${BaseDir}/12 - [Practice] Getting Started on Social Media App/010 Using Flatlist & User Stories.mp4`,
      "title": "010 Using Flatlist & User Stories"
    },
    {
      "section": 11,
      "count": 8,
      "path": `${BaseDir}/12 - [Practice] Getting Started on Social Media App/011 User Profile Image in Flatlist.mp4`,
      "title": "011 User Profile Image in Flatlist"
    },
    {
      "section": 11,
      "count": 9,
      "path": `${BaseDir}/12 - [Practice] Getting Started on Social Media App/012 Infinite Scroll.mp4`,
      "title": "012 Infinite Scroll"
    },
    {
      "section": 11,
      "count": 10,
      "path": `${BaseDir}/12 - [Practice] Getting Started on Social Media App/014 Setting Up for User Posts.mp4`,
      "title": "014 Setting Up for User Posts"
    },
    {
      "section": 11,
      "count": 11,
      "path": `${BaseDir}/12 - [Practice] Getting Started on Social Media App/016 Creating User Posts using Flatlist.mp4`,
      "title": "016 Creating User Posts using Flatlist"
    },
    {
      "section": 11,
      "count": 12,
      "path": `${BaseDir}/12 - [Practice] Getting Started on Social Media App/017 Finishing Up Social Media App.mp4`,
      "title": "017 Finishing Up Social Media App"
    },
    {
      "section": 11,
      "count": 13,
      "path": `${BaseDir}/12 - [Practice] Getting Started on Social Media App/019 Summary.mp4`,
      "title": "019 Summary"
    }
  ],
  "13 - Debugging Your Applications": [
    {
      "section": 12,
      "count": 0,
      "path": `${BaseDir}/13 - Debugging Your Applications/001 Introduction to Debugging.mp4`,
      "title": "001 Introduction to Debugging"
    },
    {
      "section": 12,
      "count": 1,
      "path": `${BaseDir}/13 - Debugging Your Applications/002 Handling Errors.mp4`,
      "title": "002 Handling Errors"
    },
    {
      "section": 12,
      "count": 2,
      "path": `${BaseDir}/13 - Debugging Your Applications/003 Logging to the Console.mp4`,
      "title": "003 Logging to the Console"
    },
    {
      "section": 12,
      "count": 3,
      "path": `${BaseDir}/13 - Debugging Your Applications/004 Documentation.mp4`,
      "title": "004 Documentation"
    }
  ],
  "14 - Building Responsive UIs": [
    {
      "section": 13,
      "count": 0,
      "path": `${BaseDir}/14 - Building Responsive UIs/001 Introduction.mp4`,
      "title": "001 Introduction"
    },
    {
      "section": 13,
      "count": 1,
      "path": `${BaseDir}/14 - Building Responsive UIs/002 What is Dimensions API.mp4`,
      "title": "002 What is Dimensions API"
    },
    {
      "section": 13,
      "count": 2,
      "path": `${BaseDir}/14 - Building Responsive UIs/004 [BEST TAKEAWAY] Responsive Scaling for Fonts, Vertical and Horizontal Sizings.mp4`,
      "title": "004 [BEST TAKEAWAY] Responsive Scaling for Fonts, Vertical and Horizontal Sizings"
    },
    {
      "section": 13,
      "count": 3,
      "path": `${BaseDir}/14 - Building Responsive UIs/006 Using Scaling Functions.mp4`,
      "title": "006 Using Scaling Functions"
    },
    {
      "section": 13,
      "count": 4,
      "path": `${BaseDir}/14 - Building Responsive UIs/008 Writing Platform-Specific Code with the Platform API.mp4`,
      "title": "008 Writing Platform-Specific Code with the Platform API"
    },
    {
      "section": 13,
      "count": 5,
      "path": `${BaseDir}/14 - Building Responsive UIs/010 Styling the Status Bar.mp4`,
      "title": "010 Styling the Status Bar"
    },
    {
      "section": 13,
      "count": 6,
      "path": `${BaseDir}/14 - Building Responsive UIs/012 Summary.mp4`,
      "title": "012 Summary"
    }
  ],
  "15 - Basic Navigation": [
    {
      "section": 14,
      "count": 0,
      "path": `${BaseDir}/15 - Basic Navigation/001 Introduction.mp4`,
      "title": "001 Introduction"
    },
    {
      "section": 14,
      "count": 1,
      "path": `${BaseDir}/15 - Basic Navigation/002 Setting Up Navigation System.mp4`,
      "title": "002 Setting Up Navigation System"
    },
    {
      "section": 14,
      "count": 2,
      "path": `${BaseDir}/15 - Basic Navigation/003 Introduction to Stack Navigation.mp4`,
      "title": "003 Introduction to Stack Navigation"
    },
    {
      "section": 14,
      "count": 3,
      "path": `${BaseDir}/15 - Basic Navigation/004 Creating & Using Stack Navigator.mp4`,
      "title": "004 Creating & Using Stack Navigator"
    },
    {
      "section": 14,
      "count": 4,
      "path": `${BaseDir}/15 - Basic Navigation/005 How to Navigate to a Different Screen.mp4`,
      "title": "005 How to Navigate to a Different Screen"
    },
    {
      "section": 14,
      "count": 5,
      "path": `${BaseDir}/15 - Basic Navigation/007 Creating Main Menu with Drawer Navigator.mp4`,
      "title": "007 Creating Main Menu with Drawer Navigator"
    },
    {
      "section": 14,
      "count": 6,
      "path": `${BaseDir}/15 - Basic Navigation/009 Getting Started with Profile UI.mp4`,
      "title": "009 Getting Started with Profile UI"
    },
    {
      "section": 14,
      "count": 7,
      "path": `${BaseDir}/15 - Basic Navigation/010 How to Create Tab Navigation on a Single Screen.mp4`,
      "title": "010 How to Create Tab Navigation on a Single Screen"
    },
    {
      "section": 14,
      "count": 8,
      "path": `${BaseDir}/15 - Basic Navigation/012 How to Style Tab Labels.mp4`,
      "title": "012 How to Style Tab Labels"
    },
    {
      "section": 14,
      "count": 9,
      "path": `${BaseDir}/15 - Basic Navigation/014 Creating Components for Our Tab Contents.mp4`,
      "title": "014 Creating Components for Our Tab Contents"
    },
    {
      "section": 14,
      "count": 10,
      "path": `${BaseDir}/15 - Basic Navigation/015 Summary.mp4`,
      "title": "015 Summary"
    }
  ],
  "16 - [Practice] Donation Application - Putting All Our Knowledge Together": [
    {
      "section": 15,
      "count": 0,
      "path": `${BaseDir}/16 - [Practice] Donation Application - Putting All Our Knowledge Together/001 Introduction.mp4`,
      "title": "001 Introduction"
    },
    {
      "section": 15,
      "count": 1,
      "path": `${BaseDir}/16 - [Practice] Donation Application - Putting All Our Knowledge Together/002 Creating Project & Setting Up.mp4`,
      "title": "002 Creating Project & Setting Up"
    },
    {
      "section": 15,
      "count": 2,
      "path": `${BaseDir}/16 - [Practice] Donation Application - Putting All Our Knowledge Together/003 Installing Custom Fonts.mp4`,
      "title": "003 Installing Custom Fonts"
    },
    {
      "section": 15,
      "count": 3,
      "path": `${BaseDir}/16 - [Practice] Donation Application - Putting All Our Knowledge Together/004 [Please Watch] Custom Fonts - Part 2.mp4`,
      "title": "004 [Please Watch] Custom Fonts - Part 2"
    },
    {
      "section": 15,
      "count": 4,
      "path": `${BaseDir}/16 - [Practice] Donation Application - Putting All Our Knowledge Together/005 Installing React Native Navigation.mp4`,
      "title": "005 Installing React Native Navigation"
    },
    {
      "section": 15,
      "count": 5,
      "path": `${BaseDir}/16 - [Practice] Donation Application - Putting All Our Knowledge Together/006 Setting Up Navigation, Styles & Home Page.mp4`,
      "title": "006 Setting Up Navigation, Styles & Home Page"
    },
    {
      "section": 15,
      "count": 6,
      "path": `${BaseDir}/16 - [Practice] Donation Application - Putting All Our Knowledge Together/007 Donation App Architectural Plan Discussion.mp4`,
      "title": "007 Donation App Architectural Plan Discussion"
    },
    {
      "section": 15,
      "count": 7,
      "path": `${BaseDir}/16 - [Practice] Donation Application - Putting All Our Knowledge Together/008 Creating Header Component.mp4`,
      "title": "008 Creating Header Component"
    },
    {
      "section": 15,
      "count": 8,
      "path": `${BaseDir}/16 - [Practice] Donation Application - Putting All Our Knowledge Together/009 Creating Button Component.mp4`,
      "title": "009 Creating Button Component"
    },
    {
      "section": 15,
      "count": 9,
      "path": `${BaseDir}/16 - [Practice] Donation Application - Putting All Our Knowledge Together/010 Creating Tab Component using useRef.mp4`,
      "title": "010 Creating Tab Component using useRef"
    },
    {
      "section": 15,
      "count": 10,
      "path": `${BaseDir}/16 - [Practice] Donation Application - Putting All Our Knowledge Together/011 Creating Badge Component using useRef.mp4`,
      "title": "011 Creating Badge Component using useRef"
    },
    {
      "section": 15,
      "count": 11,
      "path": `${BaseDir}/16 - [Practice] Donation Application - Putting All Our Knowledge Together/012 Installing Font Awesome Icons.mp4`,
      "title": "012 Installing Font Awesome Icons"
    },
    {
      "section": 15,
      "count": 12,
      "path": `${BaseDir}/16 - [Practice] Donation Application - Putting All Our Knowledge Together/013 Creating Search Input Component.mp4`,
      "title": "013 Creating Search Input Component"
    },
    {
      "section": 15,
      "count": 13,
      "path": `${BaseDir}/16 - [Practice] Donation Application - Putting All Our Knowledge Together/015 Creating a Single Donation Item Component.mp4`,
      "title": "015 Creating a Single Donation Item Component"
    },
    {
      "section": 15,
      "count": 14,
      "path": `${BaseDir}/16 - [Practice] Donation Application - Putting All Our Knowledge Together/016 Styling a Single Donation Item Component.mp4`,
      "title": "016 Styling a Single Donation Item Component"
    },
    {
      "section": 15,
      "count": 15,
      "path": `${BaseDir}/16 - [Practice] Donation Application - Putting All Our Knowledge Together/017 Summary.mp4`,
      "title": "017 Summary"
    }
  ],
  "17 - Data Management with Redux Toolkit": [
    {
      "section": 16,
      "count": 0,
      "path": `${BaseDir}/17 - Data Management with Redux Toolkit/001 Introduction.mp4`,
      "title": "001 Introduction"
    },
    {
      "section": 16,
      "count": 1,
      "path": `${BaseDir}/17 - Data Management with Redux Toolkit/002 Redux vs Redux Toolkit.mp4`,
      "title": "002 Redux vs Redux Toolkit"
    },
    {
      "section": 16,
      "count": 2,
      "path": `${BaseDir}/17 - Data Management with Redux Toolkit/004 Installing Redux JS Toolkit.mp4`,
      "title": "004 Installing Redux JS Toolkit"
    },
    {
      "section": 16,
      "count": 3,
      "path": `${BaseDir}/17 - Data Management with Redux Toolkit/005 What is a Slice & How to Create One.mp4`,
      "title": "005 What is a Slice & How to Create One"
    },
    {
      "section": 16,
      "count": 4,
      "path": `${BaseDir}/17 - Data Management with Redux Toolkit/007 What is combineReducers.mp4`,
      "title": "007 What is combineReducers"
    },
    {
      "section": 16,
      "count": 5,
      "path": `${BaseDir}/17 - Data Management with Redux Toolkit/009 Configuring Store.mp4`,
      "title": "009 Configuring Store"
    },
    {
      "section": 16,
      "count": 6,
      "path": `${BaseDir}/17 - Data Management with Redux Toolkit/011 Actions in Redux Toolkit.mp4`,
      "title": "011 Actions in Redux Toolkit"
    },
    {
      "section": 16,
      "count": 7,
      "path": `${BaseDir}/17 - Data Management with Redux Toolkit/013 Redux Logger.mp4`,
      "title": "013 Redux Logger"
    },
    {
      "section": 16,
      "count": 8,
      "path": `${BaseDir}/17 - Data Management with Redux Toolkit/014 Persisting Store.mp4`,
      "title": "014 Persisting Store"
    },
    {
      "section": 16,
      "count": 9,
      "path": `${BaseDir}/17 - Data Management with Redux Toolkit/017 Using User Reducer for Building Home Header.mp4`,
      "title": "017 Using User Reducer for Building Home Header"
    },
    {
      "section": 16,
      "count": 10,
      "path": `${BaseDir}/17 - Data Management with Redux Toolkit/019 New Reducer for Categories.mp4`,
      "title": "019 New Reducer for Categories"
    },
    {
      "section": 16,
      "count": 11,
      "path": `${BaseDir}/17 - Data Management with Redux Toolkit/020 useSelector for Creating Categories Flatlist.mp4`,
      "title": "020 useSelector for Creating Categories Flatlist"
    },
    {
      "section": 16,
      "count": 12,
      "path": `${BaseDir}/17 - Data Management with Redux Toolkit/022 Paginating through Categories Flatlist.mp4`,
      "title": "022 Paginating through Categories Flatlist"
    },
    {
      "section": 16,
      "count": 13,
      "path": `${BaseDir}/17 - Data Management with Redux Toolkit/024 Donation Items Reducer, Purging Persisted Store & Updating from Reducers.mp4`,
      "title": "024 Donation Items Reducer, Purging Persisted Store & Updating from Reducers"
    },
    {
      "section": 16,
      "count": 14,
      "path": `${BaseDir}/17 - Data Management with Redux Toolkit/025 Filtering Donation Items According to Selected Category.mp4`,
      "title": "025 Filtering Donation Items According to Selected Category"
    },
    {
      "section": 16,
      "count": 15,
      "path": `${BaseDir}/17 - Data Management with Redux Toolkit/026 Displaying Filtered Items on the Home Screen.mp4`,
      "title": "026 Displaying Filtered Items on the Home Screen"
    },
    {
      "section": 16,
      "count": 16,
      "path": `${BaseDir}/17 - Data Management with Redux Toolkit/027 Displaying Donation Items as a Grid.mp4`,
      "title": "027 Displaying Donation Items as a Grid"
    },
    {
      "section": 16,
      "count": 17,
      "path": `${BaseDir}/17 - Data Management with Redux Toolkit/028 Using Donations Reducer to Setup Single Donation Screen.mp4`,
      "title": "028 Using Donations Reducer to Setup Single Donation Screen"
    },
    {
      "section": 16,
      "count": 18,
      "path": `${BaseDir}/17 - Data Management with Redux Toolkit/029 Explore Go Back Function from Navigation.mp4`,
      "title": "029 Explore Go Back Function from Navigation"
    },
    {
      "section": 16,
      "count": 19,
      "path": `${BaseDir}/17 - Data Management with Redux Toolkit/030 Route Params & Single Donation Item Screen.mp4`,
      "title": "030 Route Params & Single Donation Item Screen"
    },
    {
      "section": 16,
      "count": 20,
      "path": `${BaseDir}/17 - Data Management with Redux Toolkit/031 Summary.mp4`,
      "title": "031 Summary"
    }
  ],
  "18 - User Authentication": [
    {
      "section": 17,
      "count": 0,
      "path": `${BaseDir}/18 - User Authentication/001 Introduction.mp4`,
      "title": "001 Introduction"
    },
    {
      "section": 17,
      "count": 1,
      "path": `${BaseDir}/18 - User Authentication/002 Input Component for Log In & Registration Screens.mp4`,
      "title": "002 Input Component for Log In & Registration Screens"
    },
    {
      "section": 17,
      "count": 2,
      "path": `${BaseDir}/18 - User Authentication/003 Log In Screen Creation.mp4`,
      "title": "003 Log In Screen Creation"
    },
    {
      "section": 17,
      "count": 3,
      "path": `${BaseDir}/18 - User Authentication/004 Registration Screen.mp4`,
      "title": "004 Registration Screen"
    },
    {
      "section": 17,
      "count": 4,
      "path": `${BaseDir}/18 - User Authentication/005 What is Firebase.mp4`,
      "title": "005 What is Firebase"
    },
    {
      "section": 17,
      "count": 5,
      "path": `${BaseDir}/18 - User Authentication/007 How Does Authentication Work.mp4`,
      "title": "007 How Does Authentication Work"
    },
    {
      "section": 17,
      "count": 6,
      "path": `${BaseDir}/18 - User Authentication/010 Firebase Setup.mp4`,
      "title": "010 Firebase Setup"
    },
    {
      "section": 17,
      "count": 7,
      "path": `${BaseDir}/18 - User Authentication/011 Firebase Authentication Setup.mp4`,
      "title": "011 Firebase Authentication Setup"
    },
    {
      "section": 17,
      "count": 8,
      "path": `${BaseDir}/18 - User Authentication/013 Creating Users using Firebase.mp4`,
      "title": "013 Creating Users using Firebase"
    },
    {
      "section": 17,
      "count": 9,
      "path": `${BaseDir}/18 - User Authentication/014 Error & Success Handling.mp4`,
      "title": "014 Error & Success Handling"
    },
    {
      "section": 17,
      "count": 10,
      "path": `${BaseDir}/18 - User Authentication/015 Logging Users in Using Firebase.mp4`,
      "title": "015 Logging Users in Using Firebase"
    },
    {
      "section": 17,
      "count": 11,
      "path": `${BaseDir}/18 - User Authentication/016 Managing User Authentication State in the App.mp4`,
      "title": "016 Managing User Authentication State in the App"
    },
    {
      "section": 17,
      "count": 12,
      "path": `${BaseDir}/18 - User Authentication/017 Navigation Flows (Authenticated, Non Authenticated).mp4`,
      "title": "017 Navigation Flows (Authenticated, Non Authenticated)"
    },
    {
      "section": 17,
      "count": 13,
      "path": `${BaseDir}/18 - User Authentication/018 Logging Out.mp4`,
      "title": "018 Logging Out"
    },
    {
      "section": 17,
      "count": 14,
      "path": `${BaseDir}/18 - User Authentication/019 Token Expiration using Firebase & AppState.mp4`,
      "title": "019 Token Expiration using Firebase & AppState"
    },
    {
      "section": 17,
      "count": 15,
      "path": `${BaseDir}/18 - User Authentication/020 Summary.mp4`,
      "title": "020 Summary"
    }
  ],
  "19 - Servers, APIs, NodeJS & Express": [
    {
      "section": 18,
      "count": 0,
      "path": `${BaseDir}/19 - Servers, APIs, NodeJS & Express/001 Introduction.mp4`,
      "title": "001 Introduction"
    },
    {
      "section": 18,
      "count": 1,
      "path": `${BaseDir}/19 - Servers, APIs, NodeJS & Express/002 What is a Server.mp4`,
      "title": "002 What is a Server"
    },
    {
      "section": 18,
      "count": 2,
      "path": `${BaseDir}/19 - Servers, APIs, NodeJS & Express/004 What is API.mp4`,
      "title": "004 What is API"
    },
    {
      "section": 18,
      "count": 3,
      "path": `${BaseDir}/19 - Servers, APIs, NodeJS & Express/006 NodeJS, ExpressJS & Setting Up Server on Local Development Environment.mp4`,
      "title": "006 NodeJS, ExpressJS & Setting Up Server on Local Development Environment"
    },
    {
      "section": 18,
      "count": 4,
      "path": `${BaseDir}/19 - Servers, APIs, NodeJS & Express/008 Upgrading our Environment using Nodemon and Babel.mp4`,
      "title": "008 Upgrading our Environment using Nodemon and Babel"
    },
    {
      "section": 18,
      "count": 5,
      "path": `${BaseDir}/19 - Servers, APIs, NodeJS & Express/009 What is Postman and How to Use It.mp4`,
      "title": "009 What is Postman and How to Use It"
    },
    {
      "section": 18,
      "count": 6,
      "path": `${BaseDir}/19 - Servers, APIs, NodeJS & Express/011 Body Parser & Get, Post, Delete & Put Requests.mp4`,
      "title": "011 Body Parser & Get, Post, Delete & Put Requests"
    },
    {
      "section": 18,
      "count": 7,
      "path": `${BaseDir}/19 - Servers, APIs, NodeJS & Express/012 Preparing Our Environment to Use Firebase Cloud Functions.mp4`,
      "title": "012 Preparing Our Environment to Use Firebase Cloud Functions"
    },
    {
      "section": 18,
      "count": 8,
      "path": `${BaseDir}/19 - Servers, APIs, NodeJS & Express/014 Transferring Local Setup to Firebase And Testing with Postman.mp4`,
      "title": "014 Transferring Local Setup to Firebase And Testing with Postman"
    },
    {
      "section": 18,
      "count": 9,
      "path": `${BaseDir}/19 - Servers, APIs, NodeJS & Express/015 Summary.mp4`,
      "title": "015 Summary"
    }
  ],
  "20 - Payment System": [
    {
      "section": 19,
      "count": 0,
      "path": `${BaseDir}/20 - Payment System/001 Introduction.mp4`,
      "title": "001 Introduction"
    },
    {
      "section": 19,
      "count": 1,
      "path": `${BaseDir}/20 - Payment System/002 What is Stripe.mp4`,
      "title": "002 What is Stripe"
    },
    {
      "section": 19,
      "count": 2,
      "path": `${BaseDir}/20 - Payment System/003 Signing Up For Stripe.mp4`,
      "title": "003 Signing Up For Stripe"
    },
    {
      "section": 19,
      "count": 3,
      "path": `${BaseDir}/20 - Payment System/004 Setting Up Stripe Server Integration.mp4`,
      "title": "004 Setting Up Stripe Server Integration"
    },
    {
      "section": 19,
      "count": 4,
      "path": `${BaseDir}/20 - Payment System/005 Setting Up Payment Screen for Donation App.mp4`,
      "title": "005 Setting Up Payment Screen for Donation App"
    },
    {
      "section": 19,
      "count": 5,
      "path": `${BaseDir}/20 - Payment System/007 Installing Stripe in Donation App.mp4`,
      "title": "007 Installing Stripe in Donation App"
    },
    {
      "section": 19,
      "count": 6,
      "path": `${BaseDir}/20 - Payment System/008 Integrating Stripe Server Side Code in Donation App.mp4`,
      "title": "008 Integrating Stripe Server Side Code in Donation App"
    },
    {
      "section": 19,
      "count": 7,
      "path": `${BaseDir}/20 - Payment System/009 Uploading Server Side Code to Firebase Functions.mp4`,
      "title": "009 Uploading Server Side Code to Firebase Functions"
    },
    {
      "section": 19,
      "count": 8,
      "path": `${BaseDir}/20 - Payment System/010 Summary.mp4`,
      "title": "010 Summary"
    }
  ],
  "21 - Building and Deploying to the Stores": [
    {
      "section": 20,
      "count": 0,
      "path": `${BaseDir}/21 - Building and Deploying to the Stores/001 Introduction.mp4`,
      "title": "001 Introduction"
    },
    {
      "section": 20,
      "count": 1,
      "path": `${BaseDir}/21 - Building and Deploying to the Stores/002 Custom App Icons for iOS & Android.mp4`,
      "title": "002 Custom App Icons for iOS & Android"
    },
    {
      "section": 20,
      "count": 2,
      "path": `${BaseDir}/21 - Building and Deploying to the Stores/004 Custom Splash Screen for iOS & Android.mp4`,
      "title": "004 Custom Splash Screen for iOS & Android"
    },
    {
      "section": 20,
      "count": 3,
      "path": `${BaseDir}/21 - Building and Deploying to the Stores/005 (macOS) Apple Developer Account.mp4`,
      "title": "005 (macOS) Apple Developer Account"
    },
    {
      "section": 20,
      "count": 4,
      "path": `${BaseDir}/21 - Building and Deploying to the Stores/006 Google Developer Account.mp4`,
      "title": "006 Google Developer Account"
    },
    {
      "section": 20,
      "count": 5,
      "path": `${BaseDir}/21 - Building and Deploying to the Stores/008 (macOS) What is TestFlight.mp4`,
      "title": "008 (macOS) What is TestFlight"
    },
    {
      "section": 20,
      "count": 6,
      "path": `${BaseDir}/21 - Building and Deploying to the Stores/009 Creating Github Account (Optional).mp4`,
      "title": "009 Creating Github Account (Optional)"
    },
    {
      "section": 20,
      "count": 7,
      "path": `${BaseDir}/21 - Building and Deploying to the Stores/010 (macOS) What is Fastlane.mp4`,
      "title": "010 (macOS) What is Fastlane"
    },
    {
      "section": 20,
      "count": 8,
      "path": `${BaseDir}/21 - Building and Deploying to the Stores/012 (macOS) How to Upload Applications to App Store.mp4`,
      "title": "012 (macOS) How to Upload Applications to App Store"
    },
    {
      "section": 20,
      "count": 9,
      "path": `${BaseDir}/21 - Building and Deploying to the Stores/014 (macOS) Updating Firebase Project & Package Naming.mp4`,
      "title": "014 (macOS) Updating Firebase Project & Package Naming"
    },
    {
      "section": 20,
      "count": 10,
      "path": `${BaseDir}/21 - Building and Deploying to the Stores/016 (Windows) Updating Firebase Project & Package Naming.mp4`,
      "title": "016 (Windows) Updating Firebase Project & Package Naming"
    },
    {
      "section": 20,
      "count": 11,
      "path": `${BaseDir}/21 - Building and Deploying to the Stores/017 (macOS)  How to Upload Applications to Google Play Store.mp4`,
      "title": "017 (macOS)  How to Upload Applications to Google Play Store"
    },
    {
      "section": 20,
      "count": 12,
      "path": `${BaseDir}/21 - Building and Deploying to the Stores/018 (Windows)  How to Upload Applications to Google Play Store.mp4`,
      "title": "018 (Windows)  How to Upload Applications to Google Play Store"
    },
    {
      "section": 20,
      "count": 13,
      "path": `${BaseDir}/21 - Building and Deploying to the Stores/019 Summary.mp4`,
      "title": "019 Summary"
    }
  ]
}
export const CourseEntries = Object.values(Course)
export const CourseSections = Object.keys(Course)
