import Theme from '../models/themeSchema.js';

export const seedDefaultThemes = async () => {
  try {
    // Check if default themes exist
    const existingThemes = await Theme.find({ isDefault: true });
    if (existingThemes.length > 0) {
      console.log('Default themes already exist');
      return;
    }

    const defaultThemes = [
      {
        name: 'Modern Light',
        primaryColor: 'blue-600',
        secondaryColor: 'purple-600',
        accentColor: 'amber-500',
        textColor: 'gray-800',
        headingColor: 'gray-900',
        linkColor: 'blue-600',
        linkHoverColor: 'blue-700',
        fontFamily: 'Inter',
        headingFontFamily: 'Inter',
        borderRadius: 'md',
        headerBgColor: 'white',
        footerBgColor: 'gray-900',
        footerTextColor: 'white',
        isDefault: true
      },
      {
        name: 'Classic Dark',
        primaryColor: 'blue-400',
        secondaryColor: 'purple-400',
        accentColor: 'amber-400',
        textColor: 'gray-300',
        headingColor: 'white',
        linkColor: 'blue-400',
        linkHoverColor: 'blue-300',
        fontFamily: 'Inter',
        headingFontFamily: 'Inter',
        borderRadius: 'md',
        headerBgColor: 'gray-900',
        footerBgColor: 'black',
        footerTextColor: 'gray-300',
        isDefault: true
      },
      {
        name: 'Minimalist',
        primaryColor: 'gray-900',
        secondaryColor: 'gray-700',
        accentColor: 'gray-500',
        textColor: 'gray-700',
        headingColor: 'gray-900',
        linkColor: 'gray-900',
        linkHoverColor: 'gray-700',
        fontFamily: 'Inter',
        headingFontFamily: 'Inter',
        borderRadius: 'none',
        headerBgColor: 'white',
        footerBgColor: 'gray-100',
        footerTextColor: 'gray-700',
        isDefault: true
      }
    ];

    await Theme.insertMany(defaultThemes);
    console.log('Default themes created successfully');
  } catch (error) {
    console.error('Error seeding default themes:', error);
    throw error;
  }
}; 