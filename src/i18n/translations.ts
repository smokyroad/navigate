export const translations = {
  en: {
    // App-level
    appTitle: 'naviGATE',
    
    // Bottom Navigation
    bottomNav: {
      itinerary: 'Itinerary',
      assistant: 'Assistant',
      profile: 'Profile',
    },
    
    // Top Bar
    topBar: {
      airportNavigator: 'naviGATE',
      aiAssistant: 'Airport Planner',
      profile: 'Profile',
    },
    
    // Map Screen
    mapScreen: {
      journeyProgress: 'Journey Progress',
      step: 'Step',
      myItinerary: 'My Itinerary',
      stops: 'stops',
      noCheckpoints: 'No checkpoints selected yet.',
      addCheckpoint: 'Add Checkpoint',
      availableCheckpoints: 'Available Checkpoints',
      optimizedRoute: 'Optimized for shortest walk',
    },
    
    // Checkpoint Library
    checkpointLibrary: {
      searchPlaceholder: 'Search checkpoints',
    },
    
    // Chat Screen
    chatScreen: {
      welcomeMessage: 'Hello! How can I help you plan your airport journey today?',
      inputPlaceholder: 'Ask for suggestions, e.g., "where to eat"',
      typing: 'Typing...',
      quickSuggestions: ['I want to eat', 'Find a lounge', 'I want to shop'],
      planMyDay: 'Plan my day',
      responseTemplate: 'Here are some suggestions for you: {{suggestions}}.',
      noResultsMessage: "I couldn't find any specific suggestions, but you can browse all available checkpoints.",
      dayPlannedMessage: "I've planned your day with a mix of dining, shopping, and relaxation. Check your itinerary!",
      planConfirmation: 'I can add {{suggestions}} to your itinerary. Shall I proceed?',
      planCancelled: 'Okay, I have cancelled the request.',
      nothingToAdd: 'It looks like your itinerary already includes a good mix of activities. There is nothing new to add.',
      confirm: 'Confirm',
      cancel: 'Cancel',
    },
    
    // Profile Screen
    profileScreen: {
      flightInformation: 'Flight Information',
      flight: 'Flight',
      gate: 'Gate',
      boarding: 'Boarding',
      preferences: 'Preferences',
      language: 'Language',
      darkMode: 'Dark mode',
      notifications: 'Notifications',
      helpSupport: 'Help & Support',
      helpCenter: 'Help Center',
      contactSupport: 'Contact Support',
      sendFeedback: 'Send Feedback',
    },
    
    // Language Options
    languages: {
      en: 'English',
      zh: '简体中文',
    },
    
    // Checkpoint Types
    checkpointTypes: {
      entrance: 'Entrance',
      customs: 'Customs',
      gate: 'Gate',
      lounge: 'Lounge',
      dining: 'Dining',
      shopping: 'Shopping',
      restroom: 'Restroom',
      security: 'Security',
      luggage: 'Luggage',
    },

    // Checkpoint Data
    checkpoints: {
      'airport-entrance': {
        name: 'Airport Entrance',
        location: 'Terminal 1, Ground Floor',
        description: 'Main entrance to the airport terminal',
      },
      'customs': {
        name: 'Customs & Immigration',
        location: 'Terminal 1, Level 5',
        description: 'Immigration and customs clearance',
      },
      'gate-23': {
        name: 'Gate 23',
        location: 'Terminal 1, Gates 20-29',
        description: 'Boarding gate for your flight',
      },
      'cafe-pacific': {
        name: 'Café Pacific',
        location: 'Terminal 1, Gate 20-29 Area',
        description: 'Coffee and light snacks with a runway view',
      },
      'pier-restaurant': {
        name: 'The Pier Restaurant',
        location: 'Terminal 1, Gate 1-19 Area',
        description: 'Full service dining with Asian and Western cuisine',
      },
      'jade-dragon': {
        name: 'Jade Dragon',
        location: 'Terminal 1, Central Area',
        description: 'Premium Chinese cuisine',
      },
      'quick-bites': {
        name: 'Quick Bites',
        location: 'Terminal 1, Gate 30-39 Area',
        description: 'Fast food and grab-and-go options',
      },
      'duty-free': {
        name: 'Duty Free',
        location: 'Terminal 1, Central Area',
        description: 'Liquor, tobacco, perfumes and cosmetics',
      },
      'electronics-hub': {
        name: 'Electronics Hub',
        location: 'Terminal 1, Gate 20-29 Area',
        description: 'Latest gadgets and tech accessories',
      },
      'fashion-gallery': {
        name: 'Fashion Gallery',
        location: 'Terminal 1, Central Area',
        description: 'Designer boutiques and fashion brands',
      },
      'wing-lounge': {
        name: 'The Wing Lounge',
        location: 'Terminal 1, Gate 1-19 Area',
        description: 'First Class lounge with spa and dining',
      },
      'pier-lounge': {
        name: 'The Pier Lounge',
        location: 'Terminal 1, Gate 20-29 Area',
        description: 'Business Class lounge with shower facilities',
      },
      'restroom-a': {
        name: 'Restroom A',
        location: 'Terminal 1, Near Gate 15',
        description: 'Full facilities including family rooms',
      },
      'restroom-b': {
        name: 'Restroom B',
        location: 'Terminal 1, Near Gate 25',
        description: 'Full facilities including accessible rooms',
      },
      'luggage-storage': {
        name: 'Luggage Storage',
        location: 'Terminal 1, Level 5',
        description: 'Secure storage lockers for your belongings',
      },
    },

    // Common Terms
    common: {
      terminal: 'Terminal',
      gate: 'Gate',
      level: 'Level',
      groundFloor: 'Ground Floor',
      centralArea: 'Central Area',
      area: 'Area',
      near: 'Near',
    },

    // Map Zones
    mapZones: {
      entryZone: 'Entry Zone',
      shoppingDining: 'Shopping & Dining',
      gates: 'Gates',
    },

    // Time related
    time: {
      minutes: 'min',
      minute: 'minute',
      startTime: 'Start Time',
      boardingTime: 'Boarding Time',
      timeRemaining: 'Time Remaining',
      timeExceeded: 'Time Exceeded!',
      beforeBoarding: 'before boarding',
      boardingWarning: 'Your itinerary may exceed boarding time!',
    },
  },
  
  zh: {
    // App-level
    appTitle: '智门',
    
    // Bottom Navigation
    bottomNav: {
      itinerary: '行程',
      assistant: '助手',
      profile: '个人',
    },
    
    // Top Bar
    topBar: {
      airportNavigator: '智门',
      aiAssistant: '智能助手',
      profile: '个人中心',
    },
    
    // Map Screen
    mapScreen: {
      journeyProgress: '行程进度',
      step: '步骤',
      myItinerary: '我的行程',
      stops: '站点',
      noCheckpoints: '还未选择任何站点。',
      addCheckpoint: '添加站点',
      availableCheckpoints: '可选站点',
      optimizedRoute: '已优化步行路线',
    },
    
    // Checkpoint Library
    checkpointLibrary: {
      searchPlaceholder: '搜索站点',
    },
    
    // Chat Screen
    chatScreen: {
      welcomeMessage: '您好！今天我能如何为您规划机场旅程？',
      inputPlaceholder: '寻求建议，例如“哪里可以吃饭”',
      typing: '正在输入...',
      quickSuggestions: ['我想吃饭', '找贵宾室', '我想购物'],
      planMyDay: '为我规划一天',
      responseTemplate: '这是一些给您的建议：{{suggestions}}。',
      noResultsMessage: '我找不到具体的建议，但您可以浏览所有可用的站点。',
      dayPlannedMessage: '我已经为您规划好了一天的行程，包括餐饮、购物和休闲。请查看您的行程！',
      planConfirmation: '我可以将 {{suggestions}} 加入您的行程。要继续吗？',
      planCancelled: '好的，我已经取消了请求。',
      nothingToAdd: '您的行程看起来已经包含了丰富的活动，没有新的项目可以添加。',
      confirm: '确认',
      cancel: '取消',
    },
    
    // Profile Screen
    profileScreen: {
      flightInformation: '航班信息',
      flight: '航班',
      gate: '登机口',
      boarding: '登机时间',
      preferences: '偏好设置',
      language: '语言',
      darkMode: '深色模式',
      notifications: '通知',
      helpSupport: '帮助与支持',
      helpCenter: '帮助中心',
      contactSupport: '联系客服',
      sendFeedback: '发送反馈',
    },
    
    // Language Options
    languages: {
      en: 'English',
      zh: '简体中文',
    },
    
    // Checkpoint Types
    checkpointTypes: {
      entrance: '入口',
      customs: '海关',
      gate: '登机口',
      lounge: '休息室',
      dining: '餐饮',
      shopping: '购物',
      restroom: '洗手间',
      security: '安检',
      luggage: '行李',
    },

    // Checkpoint Data
    checkpoints: {
      'airport-entrance': {
        name: '机场入口',
        location: '1号航站楼，地面层',
        description: '机场航站楼主要入口',
      },
      'customs': {
        name: '海关及出入境检查',
        location: '1号航站楼，5楼',
        description: '出入境及海关检查',
      },
      'gate-23': {
        name: '23号登机口',
        location: '1号航站楼，20-29号登机口区',
        description: '您航班的登机口',  
      },
      'cafe-pacific': {
        name: '太平洋咖啡厅',
        location: '1号航站楼，20-29号登机口区',
        description: '咖啡和轻食，可观看跑道景色',
      },
      'pier-restaurant': {
        name: '天际餐厅',
        location: '1号航站楼，1-19号登机口区',
        description: '全套餐饮服务，提供亚洲及西式料理',
      },
      'jade-dragon': {
        name: '翡翠龙',
        location: '1号航站楼，中央区域',
        description: '精品中式料理',
      },
      'quick-bites': {
        name: '快餐店',
        location: '1号航站楼，30-39号登机口区',
        description: '快餐及即取即走选择',
      },
      'duty-free': {
        name: '免税店',
        location: '1号航站楼，中央区域',
        description: '酒类、烟草、香水和化妆品',
      },
      'electronics-hub': {
        name: '电子产品中心',
        location: '1号航站楼，20-29号登机口区',
        description: '最新科技产品和配件',
      },
      'fashion-gallery': {
        name: '时尚廊',
        location: '1号航站楼，中央区域',
        description: '设计师精品店和时尚品牌',
      },
      'wing-lounge': {
        name: '寰宇堂休息室',
        location: '1号航站楼，1-19号登机口区',
        description: '头等舱休息室，设有水疗和餐饮服务',
      },
      'pier-lounge': {
        name: '天际休息室',
        location: '1号航站楼，20-29号登机口区',
        description: '商务舱休息室，设有淋浴设施',
      },
      'restroom-a': {
        name: 'A区洗手间',
        location: '1号航站楼，15号登机口附近',
        description: '完整设施，包括家庭洗手间',
      },
      'restroom-b': {
        name: 'B区洗手间',
        location: '1号航站楼，25号登机口附近',
        description: '完整设施，包括无障碍洗手间',
      },
      'luggage-storage': {
        name: '行李寄存',
        location: '1号航站楼，5楼',
        description: '安全的储物柜存放您的物品',
      },
    },

    // Common Terms
    common: {
      terminal: '航站楼',
      gate: '登机口',
      level: '楼',
      groundFloor: '地面层',
      centralArea: '中央区域',
      area: '区',
      near: '附近',
    },

    // Map Zones
    mapZones: {
      entryZone: '入境区',
      shoppingDining: '购物餐饮区',
      gates: '登机口区',
    },

    // Time related
    time: {
      minutes: '分钟',
      minute: '分钟',
      startTime: '开始时间',
      boardingTime: '登机时间',
      timeRemaining: '剩余时间',
      timeExceeded: '时间超出！',
      beforeBoarding: '距离登机',
      boardingWarning: '您的行程可能超过登机时间！',
    },
  },
};

export type TranslationKey = keyof typeof translations.en;
