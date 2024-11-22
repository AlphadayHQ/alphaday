export const translationEN = {
    navigation: {
        searchBarPlaceholder: "Search for assets, projects, events, etc.",
        boards: "Boards",
        openBoardsLibrary: "Open Boards Library",
        widgets: "Widgets",
        sortBy: "Sort by",
        menu: {
            sign_in: "Sign In",
            sign_out: "Sign Out",
            sign_up: "Sign Up",
            tutorial: "Tutorial",
            about_us: "About us",
            version: "Version",
            commit: "Commit",
        },
        boards_library: {
            title: "BOARDS LIBRARY",
            description:
                "Switch between boards to optimize your workflow, and pin the ones you use most often.",
            custom_boards_title: "Custom Boards",
            custom_boards_description_with_auth:
                "Create an empty board and add widgets",
            custom_boards_description:
                "Connect and verify your wallet to create new boards and see your custom boards",
        },
        widgets_library: {
            title: "Widgerts Library",
            searchBarPlaceholder: "Search for widgets",
            allWidgets: "All Widgets",
        },
        general: {
            all: "All",
            general: "General",
            nfts: "NFTs",
            daos: "DAOs",
            layer2: "Layer 2",
            defi: "DeFi",
            trading: "Trading",
            popular: "Popular",
            name: "(A-Z)",
            new: "New",
            feed: "Feed",
            trending: "Trending",
            readLater: "Read Later",
            readMore: "Read More",
            bookmarks: "Bookmarks",
            timeRange: "Time Range",
            media: "Media",
            chains: "Chains",
            protocols: "Protocols",
            less: "Less",
            more: "More",
        },
    },
    widget: {
        options: "Options",
        close_options: "Close Options",
        expand: "Expand",
        maximize: "Maximize",
        minimize: "Minimize",
        screenshot: "Screenshot",
        remove_widget: "Remove Widget",
    },
    tabs: {
        news: "NEWS",
        portfolio: "PORTFOLIO",
        calendar: "CALENDAR",
        feed: "Feed",
        trending: "Trending",
        read_later: "Read Later",
    },
    buttons: {
        connect_wallet: "Connect Wallet",
        verify_wallet: "Verify Wallet",
        add_wallet: "Add New Wallet",
        disconnect_wallet: "Disconnect_Wallet",
        enter_address: "Enter Address",
        save: "Save",
        notNow: "Not Now",
        next: "Next",
    },
    portfolio: {
        addAWallet: "Add a Wallet Address",
        inputPlaceholder: "Enter an Ethereum or ENS address",
        totalBalance: "Total Balance",
        allWallets: "All Wallets",
        asset: "Asset",
        assets: "Assets",
        nfts: "NFTs",
        balance: "Balance",
        price: "Price",
        value: "Value",
        modals: {
            title: "Wallet Connect",
            soon: "(soon)",
            metamask: "Metamask",
            selectingMethod: {
                title: "Choose a Wallet Provider",
            },
            prompted: {
                title: "Verify Wallet",
                content:
                    "Your wallet has been connected successfully. To save your customized boards, please login to Alphaday by signing a text message.",
            },
            connectionError: {
                title: "Wallet Connection Error",
                content:
                    "An error occurred trying to connect to your wallet provider. Please make sure your wallet is correctly set up.",
            },
            verificationError: {
                title: "Wallet Verification Error",
                content:
                    "Authentication failed. Is your wallet unlocked? Have you switched accounts?",
            },
            genericError: {
                title: "Unexpected Error",
                content: "Oops! Something went wrong. Please try again later.",
            },
        },
    },
    tutorials: {
        switchView_title: "Switch between boards",
        switchView_text:
            "Optimize your workflow by using different boards curated with various widgets, or create your own.",
        walletView_title: "Create a Wallet board",
        walletView_text:
            "Keep track of all information on Alphaday regarding assets in your wallet.",
        useSeachBar_title: "Search Bar",
        useSeachBar_text:
            "Search for your favorite tokens, projects, or topics to filter the content inside the widgets.",
        reArrangeWidget_title: "Re-arrange widgets",
        reArrangeWidget_text:
            "Click and drag widgets by the top bar to change their position in the dashboard, or click once to minimize.",
        useWidgetLib_title: "Widgets Library",
        useWidgetLib_text:
            "There are dozens of useful widgets available for you in the Widgets Library to pick and choose from.",
        comeBack_text:
            "Come back to the walk-through at any time in the user menu.",
    },
    market: {
        title: "MARKET",
        line: "Line",
        candlestick: "Candlestick",
        no_coins_selected: "No coins with selected tags",
        // eslint-disable-next-line no-template-curly-in-string
        history_error: "the ${selectedChartRange} history for this coin",
        market_cap: "Market Cap",
        volume_24h: "Volume 24h",
    },
    podcasts: {
        channels: "Channels",
        selected_channels: "Selected Channels",
        all_channels: "All Channels",
        channels_input_placeholder: "Search for channels",
    },
    calendar: {
        organizers: "Organizers",
        speakers: "Speakers",
        more_details: "More Details",
        noEvents: "No upcoming events found",
    },
    others: {
        tag_options: {
            auth: "ethereum, bitcoin, etc.",
            unAuth: "Sign up to pin coins and more",
        },
        change: "Change",
        name: "Name",
        your_nfts: "Your NFTs",
        est_value: "Est. Value",
        tvl: "TVL",
        no_items_found: "No Items Found",
        accept: "Accept",
        decline: "Decline",
        briefing_for: "Briefing for",
        cookie: {
            text: "We use essential cookies to make Alphaday work. We&apos;d like to use other cookies to improve and personalize your visit and to analyze our website&apos;s performance, but only if you accept.",
            acceptAll: "Accept All",
            acceptEssential: "Accept Essential",
        },
    },
    verasity: {
        token_name: "Token Name",
        token_ticker: "Token Ticker",
        sm_address: "Smart Contract Address",
        total_supply: "Total Supply",
        max_circle_supply: "Max Circulating Supply",
        circle_supply: "Circulating Supply",
    },
    messages: {
        error: {
            title: "Error",
            notFound: "The requested page could not be found.",
            generic: "An error occurred while processing your request.",
            forbidden: "You do not have permission to access this page.",
            unauthorized: "You are not authorized to access this page.",
            notAuthenticated:
                "Please connect and verify your wallet to continue",
            maxViews: "You have created maximum allowed boards",
            maxWidgets: "Your board has more widgets than allowed",
            maxViewWidgets:
                "You have exceeded the allowed count of this widget on a board",
            requestFailed:
                // eslint-disable-next-line no-template-curly-in-string
                "An error occurred fetching ${term}, please try again later",
            boardHasNoRequiredWidget:
                // eslint-disable-next-line no-template-curly-in-string
                "This ${boardName} board does not have the required ${SlugToWidgetNameMap[widget_template]} widget, to access this route you need to add the ${SlugToWidgetNameMap[widget_template]} widget to this board and refresh the page.",
            back_to_home: "Back to Home",
            no_nfts_found: "No NFTs found for the wallet(s) provided.",
        },
        success: {
            title: "Success",
            generic: "Your request was processed successfully.",
        },
        queries: {
            noResults: "No results found",
            // eslint-disable-next-line no-template-curly-in-string
            noMatchFound: "No matching ${item} found.",
        },
        portfolio: {
            signUp: "Sign up to save your portfolio",
            connectWallet: "To signup, first connect your wallet.",
            verifyWallet:
                "Sign a fee-less message to confirm ownership and log in to Alphaday to save your configuration.",
        },
        callToAction: {
            // eslint-disable-next-line no-template-curly-in-string
            signUpToBookmark: "Sign up to bookmark this ${item}",
        },
    },
    countdown: {
        labels: {
            days: "Days",
            hours: "Hours",
            minutes: "Minutes",
            seconds: "Seconds",
        },
    },
    datelocale: {
        future: "in %s",
        past: " ago",
        s: "s",
        m: "m",
        mm: "m",
        h: "h",
        hh: "h",
        d: "d",
        dd: "d",
        w: "w",
        M: "mo",
        MM: "mo",
        y: "y",
        ytd: "ytd",
        yy: "y",
    },
    gas: {
        title: "Gas Price",
        fast: "Fast",
        standard: "Standard",
        slow: "Slow",
        beacon_chain_data: "Beacon Chain Data",
    },
    qna: {
        intro: "This widget is an interface to Alphaday&apos;s aggregated crypto data. You can query this data by simply typing arbitrary questions in natural language, like for instance &quot;what is the project with the highest tvl?&quot;",
        highlight:
            "You need to connect and verify your wallet to use this widget.",
        button: "Ask a question",
    },
};

export const translationJA: typeof translationEN = {
    navigation: {
        searchBarPlaceholder: "アセット、プロジェクト、イベントなどを検索",
        boards: "ボード",
        openBoardsLibrary: "ボードライブラリを開く",
        widgets: "ウィジェット",
        sortBy: "並び替え",
        menu: {
            sign_in: "サインイン",
            sign_out: "サインアウト",
            sign_up: "サインアップ",
            tutorial: "チュートリアル",
            about_us: "私たちについて",
            version: "バージョン",
            commit: "コミット",
        },
        boards_library: {
            title: "ボードライブラリ",
            description:
                "ワークフローを最適化するためにボードを切り替え、よく使うものをピン留めしましょう。",
            custom_boards_title: "カスタムボード",
            custom_boards_description_with_auth:
                "空のボードを作成し、ウィジェットを追加してください",
            custom_boards_description:
                "ウォレットを接続して認証し、新しいボードを作成して自分のカスタムボードを確認できます",
        },
        widgets_library: {
            title: "ウィジェットライブラリ",
            searchBarPlaceholder: "ウィジェットを検索",
            allWidgets: "すべてのウィジェット",
        },
        general: {
            all: "すべて",
            general: "一般",
            nfts: "NFT",
            daos: "DAO",
            layer2: "レイヤー2",
            defi: "DeFi",
            trading: "取引",
            popular: "人気",
            name: "名前",
            new: "新着",
            feed: "フィード",
            trending: "トレンド",
            readLater: "後で読む",
            readMore: "続きを読む",
            bookmarks: "ブックマーク",
            timeRange: "時間帯",
            media: "メディア",
            chains: "チェーン",
            protocols: "プロトコル",
            less: "少なく",
            more: "もっと",
        },
    },
    widget: {
        options: "オプション",
        close_options: "オプションを閉じる",
        expand: "拡大",
        maximize: "最大化",
        minimize: "最小化",
        screenshot: "スクリーンショット",
        remove_widget: "ウィジェットを削除",
    },
    tabs: {
        news: "ニュース",
        portfolio: "ポートフォリオ",
        calendar: "カレンダー",
        feed: "フィード",
        trending: "トレンド",
        read_later: "後で読む",
    },
    buttons: {
        connect_wallet: "ウォレットを接続",
        verify_wallet: "ウォレットを確認",
        add_wallet: "新しいウォレットを追加",
        disconnect_wallet: "ウォレットを切断",
        enter_address: "アドレスを入力",
        save: "保存",
        notNow: "今はしない",
        next: "次へ",
    },
    portfolio: {
        addAWallet: "ウォレットアドレスを追加",
        inputPlaceholder: "EthereumまたはENSアドレスを入力してください",
        totalBalance: "合計残高",
        allWallets: "すべてのウォレット",
        asset: "資産",
        assets: "資産",
        nfts: "NFTs",
        balance: "残高",
        price: "価格",
        value: "価値",
        modals: {
            title: "ウォレットコネクト",
            soon: "（近日中）",
            metamask: "メタマスク",
            selectingMethod: {
                title: "ウォレットプロバイダーを選択",
            },
            prompted: {
                title: "ウォレットの確認",
                content:
                    "ウォレットが正常に接続されました。カスタマイズしたボードを保存するには、テキストメッセージに署名してAlphadayにログインしてください。",
            },
            connectionError: {
                title: "ウォレット接続エラー",
                content:
                    "ウォレットプロバイダーへの接続中にエラーが発生しました。ウォレットが正しく設定されていることを確認してください。",
            },
            verificationError: {
                title: "ウォレット確認エラー",
                content:
                    "認証に失敗しました。ウォレットがロック解除されていますか？アカウントを切り替えましたか？",
            },
            genericError: {
                title: "予期しないエラー",
                content:
                    "おっと！問題が発生しました。後でもう一度お試しください。",
            },
        },
    },
    tutorials: {
        switchView_title: "ボード間を切り替える",
        switchView_text:
            "さまざまなウィジェットを使って異なるボードを活用したり、自分で作成したりして、ワークフローを最適化しましょう。",
        walletView_title: "ウォレットボードを作成",
        walletView_text:
            "ウォレット内の資産に関するすべての情報をAlphadayで追跡できます。",
        useSeachBar_title: "検索バー",
        useSeachBar_text:
            "お気に入りのトークン、プロジェクト、またはトピックを検索して、ウィジェット内のコンテンツをフィルタリングできます。",
        reArrangeWidget_title: "ウィジェットを再配置",
        reArrangeWidget_text:
            "上部のバーを使ってウィジェットをドラッグして位置を変更するか、1回クリックして最小化できます。",
        useWidgetLib_title: "ウィジェットライブラリ",
        useWidgetLib_text:
            "ウィジェットライブラリには、選んで使える便利なウィジェットが多数用意されています。",
        comeBack_text: "ユーザーメニューからいつでもウォークスルーに戻れます。",
    },
    market: {
        title: "マーケット",
        line: "ライン",
        candlestick: "ローソク足",
        no_coins_selected: "選択したタグのコインはありません",
        // eslint-disable-next-line no-template-curly-in-string
        history_error: "このコインの${selectedChartRange}履歴",
        market_cap: "時価総額",
        volume_24h: "24時間の出来高",
    },
    podcasts: {
        channels: "チャンネル",
        selected_channels: "選択したチャンネル",
        all_channels: "すべてのチャンネル",
        channels_input_placeholder: "チャンネルを検索",
    },
    calendar: {
        organizers: "主催者",
        speakers: "スピーカー",
        more_details: "詳細",
        noEvents: "近日開催されるイベントはありませ",
    },
    others: {
        tag_options: {
            auth: "ethereum、bitcoinなど",
            unAuth: "コインをピン留めなどのためにサインアップ",
        },
        change: "変更",
        name: "名前",
        your_nfts: "あなたのNFT",
        est_value: "見積もり価値",
        tvl: "TVL",
        no_items_found: "アイテムが見つかりません",
        accept: "受け入れる",
        decline: "辞退",
        briefing_for: "ブリーフィング",
        cookie: {
            text: "Alphadayを動作させるために必要なクッキーを使用しています。他のクッキーを使用して、訪問を改善し、パーソナライズし、ウェブサイトのパフォーマンスを分析したいと考えていますが、それはあなたが受け入れる場合にのみです。",
            acceptAll: "すべてを受け入れる",
            acceptEssential: "必要なものを受け入れる",
        },
    },
    verasity: {
        token_name: "トークン名",
        token_ticker: "トークンティッカー",
        sm_address: "スマートコントラクトアドレス",
        total_supply: "総供給量",
        max_circle_supply: "最大循環供給量",
        circle_supply: "循環供給量",
    },
    messages: {
        error: {
            title: "エラー",
            notFound: "リクエストされたページが見つかりませんでした。",
            generic: "リクエストの処理中にエラーが発生しました。",
            forbidden: "このページにアクセスする権限がありません。",
            unauthorized: "このページにアクセスする権限がありません。",
            notAuthenticated:
                "続行するにはウォレットを接続して確認してください",
            maxViews: "作成できるボードの最大数に達しました",
            maxWidgets: "ボードに追加できるウィジェットの数を超えました",
            maxViewWidgets:
                "ボード上のこのウィジェットの許可された数を超えました",
            requestFailed:
                // eslint-disable-next-line no-template-curly-in-string
                "${term}の取得中にエラーが発生しました。後で再試行してください",
            boardHasNoRequiredWidget:
                // eslint-disable-next-line no-template-curly-in-string
                "この${boardName}ボードには、${SlugToWidgetNameMap[widget_template]}ウィジェットが必要です。このルートにアクセスするには、${SlugToWidgetNameMap[widget_template]}ウィジェットをこのボードに追加してページを更新する必要があります。",
            back_to_home: "ホームに戻る",
            no_nfts_found:
                "指定されたウォレット用のNFTが見つかりませんでした。",
        },
        success: {
            title: "成功",
            generic: "リクエストが正常に処理されました。",
        },
        queries: {
            noResults: "結果が見つかりません",
            // eslint-disable-next-line no-template-curly-in-string
            noMatchFound: "${item}が見つかりませんでした。",
        },
        portfolio: {
            signUp: "ポートフォリオを保存するにはサインアップしてください",
            connectWallet:
                "サインアップするには、まずウォレットを接続してください。",
            verifyWallet:
                "所有権を確認し、設定を保存するためにAlphadayにログインするには、手数料のないメッセージに署名してください。",
        },
        callToAction: {
            signUpToBookmark:
                // eslint-disable-next-line no-template-curly-in-string
                "この${item}をブックマークするにはサインアップしてください",
        },
    },
    countdown: {
        labels: {
            days: "日",
            hours: "時間",
            minutes: "分",
            seconds: "秒",
        },
    },
    datelocale: {
        future: "後",
        past: "前",
        s: "秒",
        m: "分",
        mm: "分",
        h: "時間",
        hh: "時間",
        d: "日",
        dd: "日",
        w: "週",
        M: "ヶ月",
        MM: "ヶ月",
        y: "年",
        yy: "年",
        ytd: "今年",
    },
    gas: {
        title: "ガス価格",
        fast: "高速",
        standard: "標準",
        slow: "遅い",
        beacon_chain_data: "ビーコンチェーンデータ",
    },
    qna: {
        intro: "このウィジェットはAlphadayの集約された暗号データへのインターフェイスです。たとえば、「最高のtvlを持つプロジェクトは何ですか？」など、自然言語で任意の質問を入力してこのデータをクエリできます。",
        highlight:
            "このウィジェットを使用するには、ウォレットを接続して確認する必要があります。",
        button: "質問する",
    },
};
