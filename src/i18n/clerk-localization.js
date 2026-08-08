const khmer = {
  locale: 'km-KH',
  socialButtonsBlockButton: 'បន្តជាមួយ {{provider|titleize}}',
  dividerText: 'ឬ',
  formFieldLabel__emailAddress: 'អាសយដ្ឋានអ៊ីមែល',
  formFieldLabel__password: 'ពាក្យសម្ងាត់',
  formFieldLabel__firstName: 'នាមខ្លួន',
  formFieldLabel__lastName: 'នាមត្រកូល',
  formFieldInputPlaceholder__emailAddress: 'បញ្ចូលអ៊ីមែលរបស់អ្នក',
  formFieldInputPlaceholder__password: 'បញ្ចូលពាក្យសម្ងាត់របស់អ្នក',
  formButtonPrimary: 'បន្ត',
  signInStartTitle: 'ចូលគណនី',
  signInStartSubtitle: 'សូមស្វាគមន៍ត្រឡប់មកកាន់ Sea Breeze',
  signUpStartTitle: 'បង្កើតគណនី',
  signUpStartSubtitle: 'ចាប់ផ្តើមដំណើររបស់អ្នកជាមួយ Sea Breeze',
  signInAlternativeMethodsTitle: 'ប្រើវិធីផ្សេង',
  signUpAlternativeMethodsTitle: 'ប្រើវិធីផ្សេង',
  signInAccountSwitchTitle: 'ចូលគណនី',
  signUpAccountSwitchTitle: 'បង្កើតគណនី',
  signInAccountSwitchAction: 'ចូលគណនី',
  signUpAccountSwitchAction: 'បង្កើតគណនី',
  footerActionLink__useAnotherMethod: 'ប្រើវិធីផ្សេង',
  formFieldAction__forgotPassword: 'ភ្លេចពាក្យសម្ងាត់?',
  backButton: 'ត្រឡប់ក្រោយ',
};

export function getClerkLocalization(locale) {
  return locale === 'km' ? khmer : undefined;
}
