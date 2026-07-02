import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "EN" | "HI";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  EN: {}, // English uses keys directly as text
  HI: {
    "Home": "होम",
    "Governance": "शासन",
    "Team": "टीम",
    "Members": "सदस्य",
    "List of Films": "फिल्मों की सूची",
    "Schemes": "योजनाएं",
    "Contact": "संपर्क",
    "License From": "लाइसेंस फॉर्म",
    "Member Login": "सदस्य लॉगिन",
    "Sign In": "साइन इन",
    "Sign Up": "साइन अप",
    "Email": "ईमेल",
    "Password": "पासवर्ड",
    "Forgot Password !": "पासवर्ड भूल गए !",
    "Sign In With Google": "गूगल के साथ साइन इन करें",
    "or continue with": "या इसके साथ जारी रखें",
    "Don't have an account?": "खाता नहीं है?",
    "Language": "भाषा",
    "Profile": "प्रोफ़ाइल",
    "Dashboard": "डैशबोर्ड",
    "Logout": "लॉगआउट",
    "Legal Advisor": "कानूनी सलाहकार",
    "Legal Advisory Council": "कानूनी सलाहकार परिषद",
    "Know More": "और जानें",
    "For active litigation support, formal corporate inquiries, or enforcement notifications, direct correspondence to:": "सक्रिय मुकदमेबाजी समर्थन, औपचारिक कॉर्पोरेट पूछताछ, या प्रवर्तन सूचनाओं के लिए, सीधे पत्राचार करें:",
    "Governing Board": "शासी बोर्ड",
    "Honorary Advisory Board": "मानद सलाहकार बोर्ड",
    "Committee": "समिति",
    "Designation": "पद",
    "Location": "स्थान",
    "Date of Birth": "जन्म तिथि",
    "About": "के बारे में",
    "Biography": "जीवनी",
    "Edit Profile": "प्रोफ़ाइल संपादित करें",
    "Save Changes": "बदलाव सहेजें",
    "Cancel": "रद्द करें",
    "Change Password": "पासवर्ड बदलें",
    "Current Password": "वर्तमान पासवर्ड",
    "New Password": "नया पासवर्ड",
    "Confirm New Password": "नए पासवर्ड की पुष्टि करें",
    "All password fields are required.": "सभी पासवर्ड फ़ील्ड आवश्यक हैं।",
    "New passwords do not match.": "नए पासवर्ड मेल नहीं खाते।",
    "Profile updated successfully!": "प्रोफ़ाइल सफलतापूर्वक अपडेट की गई!",
    "Password updated successfully!": "पासवर्ड सफलतापूर्वक अपडेट किया गया!",
    "Return to Homepage": "होमपेज पर लौटें",
    "First Name*": "पहला नाम*",
    "Last Name*": "अंतिम नाम*",
    "Your Email*": "आपका ईमेल*",
    "Mobile No*": "मोबाइल नंबर*",
    "Company*": "कंपनी*",
    "Submit": "जमा करें",
    "Submitting...": "जमा किया जा रहा है...",
    "Contact Us for CINEFIL Licence": "CINEFIL लाइसेंस के लिए हमसे संपर्क करें",
    "Premises Information": "परिसर की जानकारी",
    "NAME OF THE PREMISES *": "परिसर का नाम *",
    "TOTAL SQ. FT. AREA OF THE PREMISES *": "परिसर का कुल वर्ग फुट क्षेत्र *",
    "TOTAL NUMBER OF SITTINGS (OF RESTAURANT/BAR/OTHERS) *": "सिटिंग्स की कुल संख्या (रेस्टोरेंट/बार/अन्य) *",
    "CONTACT PERSON *": "संपर्क व्यक्ति *",
    "TELEPHONE NO. / MOBILE NO. *": "टेलीफोन नंबर / मोबाइल नंबर *",
    "EMAIL ID *": "ईमेल आईडी *",
    "GST NUMBER *": "जीएसटी नंबर *",
    "TAN NUMBER *": "टैन नंबर *",
    "PAN NUMBER *": "पैन नंबर *",
    "LICENCE PERIOD *": "लाइसेंस अवधि *",
    "TOTAL ROOMS (IF HOTEL/HOSTEL/HOSPITAL/OTHERS) *": "कुल कमरे (यदि होटल/हॉस्टल/अस्पताल/अन्य) *",
    "NUMBER OF TV SETS": "टीवी सेट की संख्या",
    "IF ANY OTHER MEANS OF DISPLAY, SPECIFY": "यदि प्रदर्शन का कोई अन्य साधन है, तो निर्दिष्ट करें",
    "FULL ADDRESS *": "पूरा पता *",
    "Submit Application": "आवेदन जमा करें",
    "Please fill in all required fields.": "कृपया सभी आवश्यक फ़ील्ड भरें।",
    "Secure login with encrypted credentials. Use the username and password provided when your membership was approved.": "सुरक्षित लॉगिन के साथ एन्क्रिप्टेड क्रेडेंशियल। आपके सदस्यता अनुमोदन के समय प्रदान किए गए उपयोगकर्ता नाम और पासवर्ड का उपयोग करें।",
    "Member Access": "सदस्य पहुंच",
    "Approved members receive login credentials automatically upon membership approval.": "अनुमोदित सदस्यों को सदस्यता अनुमोदन पर स्वचालित रूप से लॉगिन क्रेडेंशियल प्राप्त होते हैं।",
    "After login": "लॉगिन के बाद",
    "Access your dashboard to manage films, view royalties, and update your profile.": "फिल्मों को प्रबंधित करने, रॉयल्टी देखने और अपनी प्रोफ़ाइल अपडेट करने के लिए अपने डैशबोर्ड तक पहुंचें।",
    "Login instructions": "लॉगिन निर्देश",
    "Enter your username and password provided when your membership was approved.": "आपके सदस्यता अनुमोदन के समय प्रदान किया गया उपयोगकर्ता नाम और पासवर्ड दर्ज करें।",
    "Welcome to CINEFIL Member Portal": "CINEFIL सदस्य पोर्टल में आपका स्वागत है",
    "Approved members can login to access their dashboard, manage films, view royalties, and update their profile.": "अनुमोदित सदस्य अपने डैशबोर्ड तक पहुंचने, फिल्मों को प्रबंधित करने, रॉयल्टी देखने और अपनी प्रोफ़ाइल अपडेट करने के लिए लॉगिन कर सकते हैं।",
    "Auto-generated credentials": "स्वचालित रूप से उत्पन्न क्रेडेंशियल",
    "Username and password provided upon membership approval.": "सदस्यता अनुमोदन पर प्रदान किया गया उपयोगकर्ता नाम और पासवर्ड।",
    "Member dashboard": "सदस्य डैशबोर्ड",
    "Access your personal dashboard after login to manage your account.": "अपने खाते को प्रबंधित करने के लिए लॉगिन के बाद अपने व्यक्तिगत डैशबोर्ड तक पहुंचें।",
    "Need help?": "मदद की ज़रूरत है?",
    "Contact support if you cannot access your account.": "यदि आप अपने खाते तक नहीं पहुंच सकते हैं तो सहायता से संपर्क करें।",
    "Not a member?": "सदस्य नहीं हैं?",
    "Visit the Membership Form page to apply for CINEFIL membership.": "CINEFIL सदस्यता के लिए आवेदन करने के लिए सदस्यता फॉर्म पृष्ठ पर जाएं।",
    "Email or Username": "ईमेल या उपयोगकर्ता नाम",
    "Enter your email or username": "अपना ईमेल या उपयोगकर्ता नाम दर्ज करें",
    "Enter your password": "अपना पासवर्ड दर्ज करें",
    "Login now": "अभी लॉगिन करें",
    "Search Films...": "फिल्में खोजें...",
    "Register New Film": "नई फिल्म पंजीकृत करें",
    "No films registered yet.": "अभी तक कोई फिल्म पंजीकृत नहीं है।",
    "Status": "स्थिति",
    "Action": "कार्रवाई",
    "View": "देखें",
    "Edit": "संपादित करें",
    "Delete": "हटाएं",
    "Close": "बंद करें",
    "Guest User": "अतिथि उपयोगकर्ता",
    "Join CINEFIL Today": "आज ही CINEFIL से जुड़ें",
    "CEO / Authorised Officer": "सीईओ / प्राधिकृत अधिकारी",
    "Legal Officer": "कानूनी अधिकारी",
    "Membership Executive": "सदस्यता कार्यकारी",
    "Rights Verification Officer": "अधिकार सत्यापन अधिकारी",
    "Membership Committee": "सदस्यता समिति",
    "Admin": "एडमिन",
    "User": "उपयोगकर्ता",
    "Navigation": "नेविगेशन",
    "Membership": "सदस्यता",
    "Resources": "संसाधन",
    "Auth": "प्रमाणीकरण",
    "Notifications": "सूचनाएं",
    "Mark all read": "सभी को पढ़ा हुआ चिह्नित करें",
    "No notifications yet.": "अभी तक कोई सूचना नहीं है।",
    "Works": "रचनाएँ",
    "Join Cinefil": "सिनेफिल से जुड़ें",
    "Member Dashboard": "सदस्य डैशबोर्ड",
    "CEO Dashboard": "सीईओ डैशबोर्ड",
    "Executive Dashboard": "कार्यकारी डैशबोर्ड",
    "Legal Dashboard": "कानूनी डैशबोर्ड",
    "Verification Dashboard": "सत्यापन डैशबोर्ड",
    "Officer Dashboard": "अधिकारी डैशबोर्ड",
    "Honorary Board": "मानद बोर्ड",
    "Producers & Owners": "निर्माता और मालिक",
    "Films": "फिल्मों"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("cinefil_language");
    return (saved === "HI" ? "HI" : "EN") as Language;
  });

  const setLanguage = (lang: Language) => {
    localStorage.setItem("cinefil_language", lang);
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}