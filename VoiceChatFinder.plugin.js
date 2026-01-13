/**
 * @name VoiceChatFinder
 * @author mcruz
 * @version 3.1.0
 * @description Adds a button to find all servers with active voice chats. Shows a modal with all voice activity across your servers, with search, friend highlighting, activity status, streaming indicators, and clickable filters.
 */

module.exports = class VoiceChatFinder {
    constructor(meta) {
        this.meta = meta;
    }

    start() {
        const { DOM } = BdApi;

        DOM.addStyle(this.meta.name, `
            /* Make the modal wider */
            [class*="modal"] [class*="root"]:has(.vcf-modal-content) {
                width: 1000px !important;
                max-width: 95vw !important;
            }
            .vcf-panel-button {
                width: 32px;
                height: 32px;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                position: relative;
                color: var(--interactive-normal);
                background: transparent;
                border: none;
                transition: color 0.15s, background-color 0.15s;
            }
            .vcf-panel-button:hover {
                color: var(--interactive-hover);
                background: var(--background-modifier-hover);
            }
            .vcf-panel-button.has-activity {
                color: var(--text-positive);
            }
            .vcf-panel-button.has-activity::after {
                content: '';
                position: absolute;
                top: 2px;
                right: 2px;
                width: 8px;
                height: 8px;
                background: var(--status-positive);
                border-radius: 50%;
            }
            .vcf-modal-content {
                padding: 0;
                max-height: 70vh;
                overflow-y: auto;
            }
            .vcf-server-item {
                display: flex;
                align-items: center;
                padding: 12px 16px;
                cursor: pointer;
                transition: background 0.15s;
            }
            .vcf-server-item:hover {
                background: var(--background-modifier-hover);
            }
            .vcf-server-icon {
                width: 40px;
                height: 40px;
                border-radius: 12px;
                margin-right: 12px;
                object-fit: cover;
            }
            .vcf-server-icon-placeholder {
                width: 40px;
                height: 40px;
                border-radius: 12px;
                margin-right: 12px;
                background: var(--background-secondary);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                font-size: 16px;
                color: var(--text-normal);
            }
            .vcf-server-info {
                flex: 1;
                min-width: 0;
            }
            .vcf-server-name {
                font-weight: 600;
                font-size: 16px;
                color: var(--header-primary);
                margin-bottom: 2px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .vcf-channel-summary {
                font-size: 13px;
                color: var(--text-muted);
            }
            .vcf-user-count {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 6px 12px;
                background: var(--background-secondary);
                border-radius: 16px;
                font-weight: 600;
                font-size: 14px;
                color: var(--text-positive);
            }
            .vcf-no-activity {
                text-align: center;
                padding: 60px 40px;
                color: var(--text-muted);
            }
            .vcf-no-activity svg {
                margin-bottom: 16px;
                opacity: 0.5;
            }
            .vcf-no-activity-text {
                font-size: 16px;
            }
            .vcf-header {
                padding: 16px;
                border-bottom: 1px solid var(--background-modifier-accent);
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .vcf-header-icon {
                width: 32px;
                height: 32px;
                background: var(--brand-experiment);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .vcf-header-icon svg {
                color: white;
            }
            .vcf-header-text h2 {
                font-size: 20px;
                font-weight: 600;
                color: var(--header-primary);
                margin: 0;
            }
            .vcf-header-text p {
                font-size: 12px;
                color: var(--text-muted);
                margin: 2px 0 0 0;
            }
            .vcf-channels-dropdown {
                padding: 4px 16px 8px 68px;
            }
            .vcf-channel-item {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 6px 10px;
                background: var(--background-secondary);
                border-radius: 6px;
                margin-bottom: 4px;
                font-size: 13px;
                color: var(--text-normal);
                cursor: pointer;
            }
            .vcf-channel-item:hover {
                background: var(--background-secondary-alt);
            }
            .vcf-channel-item svg {
                color: var(--text-muted);
                flex-shrink: 0;
            }
            .vcf-channel-name {
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .vcf-channel-count {
                color: var(--text-positive);
                font-weight: 600;
            }
            .vcf-channel-users {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                padding: 8px 10px;
                background: var(--background-tertiary);
                border-radius: 0 0 6px 6px;
                margin-top: -4px;
                margin-bottom: 4px;
                max-height: 150px;
                overflow-y: auto;
            }
            .vcf-user-chip {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 4px 10px 4px 4px;
                background: var(--background-secondary);
                border-radius: 16px;
                font-size: 12px;
                color: var(--text-normal);
                cursor: pointer;
                transition: background 0.15s;
            }
            .vcf-user-chip:hover {
                background: var(--background-modifier-hover);
            }
            .vcf-user-chip.is-me {
                background: var(--brand-experiment);
                color: white;
            }
            .vcf-user-chip.is-me:hover {
                background: var(--brand-experiment-560);
            }
            .vcf-user-avatar {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                object-fit: cover;
            }
            .vcf-user-avatar-placeholder {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: var(--background-modifier-accent);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                font-weight: 600;
            }
            .vcf-channel-header {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 10px;
                background: var(--background-secondary);
                border-radius: 6px;
                margin-bottom: 0;
                font-size: 13px;
                color: var(--text-normal);
                cursor: pointer;
            }
            .vcf-channel-header:hover {
                background: var(--background-secondary-alt);
            }
            .vcf-channel-header.has-users {
                border-radius: 6px 6px 0 0;
            }
            .vcf-channel-header.collapsed {
                border-radius: 6px;
                margin-bottom: 4px;
            }
            .vcf-join-btn {
                padding: 4px 12px;
                background: var(--brand-experiment);
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                margin-left: auto;
                flex-shrink: 0;
            }
            .vcf-join-btn:hover {
                background: var(--brand-experiment-560);
            }
            .vcf-expand-icon {
                color: var(--text-muted);
                transition: transform 0.2s;
                flex-shrink: 0;
            }
            .vcf-expand-icon.expanded {
                transform: rotate(90deg);
            }
            /* Search bar */
            .vcf-search-container {
                padding: 12px 16px;
                border-bottom: 1px solid var(--background-modifier-accent);
            }
            .vcf-search-input {
                width: 100%;
                padding: 10px 12px;
                background: var(--background-tertiary);
                border: none;
                border-radius: 8px;
                color: var(--text-normal);
                font-size: 14px;
                outline: none;
            }
            .vcf-search-input::placeholder {
                color: var(--text-muted);
            }
            .vcf-search-input:focus {
                box-shadow: 0 0 0 2px var(--brand-experiment);
            }
            /* Friend badge */
            .vcf-friend-badge {
                background: var(--status-positive);
                color: white;
                font-size: 9px;
                font-weight: 700;
                padding: 2px 5px;
                border-radius: 4px;
                margin-left: 4px;
                text-transform: uppercase;
            }
            .vcf-user-chip.is-friend {
                border: 2px solid var(--status-positive);
            }
            .vcf-me-badge {
                background: var(--brand-experiment);
                color: white;
                font-size: 9px;
                font-weight: 700;
                padding: 2px 5px;
                border-radius: 4px;
                margin-left: 4px;
                text-transform: uppercase;
            }
            /* Activity status */
            .vcf-activity {
                font-size: 10px;
                color: var(--text-muted);
                max-width: 100px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .vcf-user-info {
                display: flex;
                flex-direction: column;
                gap: 1px;
                min-width: 0;
            }
            .vcf-user-name {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            /* Streaming indicator */
            .vcf-streaming-icon {
                color: var(--premium-tier-2-purple-for-gradients-2);
                margin-left: 4px;
                flex-shrink: 0;
            }
            .vcf-video-icon {
                color: var(--status-positive);
                margin-left: 4px;
                flex-shrink: 0;
            }
            .vcf-user-icons {
                display: flex;
                align-items: center;
                gap: 2px;
                margin-left: auto;
                flex-shrink: 0;
            }
            /* Stats bar */
            .vcf-stats-bar {
                display: flex;
                gap: 16px;
                padding: 8px 16px;
                background: var(--background-secondary);
                font-size: 12px;
                color: var(--text-muted);
            }
            .vcf-stat {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                transition: background 0.15s, color 0.15s;
            }
            .vcf-stat:hover {
                background: var(--background-modifier-hover);
            }
            .vcf-stat.active {
                background: var(--brand-experiment);
                color: white;
            }
            .vcf-stat.active .vcf-stat-value {
                color: white;
            }
            .vcf-stat-value {
                color: var(--text-normal);
                font-weight: 600;
            }
        `);

        this.patchAccountPanel();
        this.updateInterval = setInterval(() => this.updateButtonState(), 5000);
    }

    stop() {
        const { DOM, Patcher } = BdApi;
        DOM.removeStyle(this.meta.name);
        Patcher.unpatchAll(this.meta.name);
        if (this.updateInterval) clearInterval(this.updateInterval);

        // Remove manually added button if exists
        const btn = document.querySelector('.vcf-panel-button');
        if (btn) btn.remove();
    }

    patchAccountPanel() {
        const { Webpack, Patcher, React } = BdApi;

        // Try to find and patch the Account component
        const Account = Webpack.getByStrings("isCopied", "useInteractionState", {defaultExport: false});

        if (Account) {
            // Find the correct key to patch
            const key = Object.keys(Account).find(k => {
                const str = Account[k]?.toString?.() || "";
                return str.includes("isCopied") || str.includes("showTaglessName");
            });

            if (key) {
                Patcher.after(this.meta.name, Account, key, (_, __, returnValue) => {
                    if (!returnValue?.props?.children) return;

                    const buttons = BdApi.Utils.findInTree(returnValue,
                        (n) => n?.props?.className?.includes?.("buttons"),
                        {walkable: ["props", "children"]}
                    );

                    if (buttons?.props?.children && Array.isArray(buttons.props.children)) {
                        const vcfButton = this.createReactButton();
                        // Insert before the last element (settings)
                        buttons.props.children.splice(buttons.props.children.length - 1, 0, vcfButton);
                    }
                });
                return;
            }
        }

        // Fallback: Use DOM injection with mutation observer
        this.useDOMFallback();
    }

    useDOMFallback() {
        this.observer = new MutationObserver(() => {
            if (!document.querySelector('.vcf-panel-button')) {
                this.addButtonToPanel();
            }
        });
        this.observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => this.addButtonToPanel(), 500);
    }

    addButtonToPanel() {
        if (document.querySelector('.vcf-panel-button')) return;

        // Find buttons area - look for the container with mute/deafen buttons
        // Using multiple selectors for robustness
        const selectors = [
            '[class*="panels"] [class*="container"] [class*="buttons"]',
            '[class*="panel"] [class*="buttons"]',
            'section[class*="panels"] > [class*="container"]'
        ];

        let container = null;
        for (const sel of selectors) {
            container = document.querySelector(sel);
            if (container) break;
        }

        if (!container) {
            // Last resort: find by looking for mute button
            const muteBtn = document.querySelector('button[aria-label="Mute"]');
            if (muteBtn) {
                container = muteBtn.closest('[class*="buttons"]') || muteBtn.parentElement?.parentElement;
            }
        }

        if (!container) return;

        // Store reference to this for the click handler
        const self = this;

        const button = document.createElement('button');
        button.className = 'vcf-panel-button';
        button.setAttribute('aria-label', 'Voice Chat Finder');
        button.title = 'Voice Chat Finder';
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3a4 4 0 0 0-4 4v5a4 4 0 0 0 8 0V7a4 4 0 0 0-4-4Z"/>
                <path d="M6 12a1 1 0 0 0-2 0 8 8 0 0 0 7 7.93V22a1 1 0 1 0 2 0v-2.07A8 8 0 0 0 20 12a1 1 0 1 0-2 0 6 6 0 1 1-12 0Z"/>
            </svg>
        `;

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            try {
                self.showVoiceActivityModal();
            } catch (err) {
                console.error('[VoiceChatFinder] Error:', err);
                BdApi.UI.showToast("Error opening Voice Chat Finder", { type: "error" });
            }
        });

        // Try to insert before settings button, otherwise just append
        const allButtons = container.querySelectorAll('button');
        const lastButton = allButtons[allButtons.length - 1];

        if (lastButton && lastButton.parentNode === container) {
            container.insertBefore(button, lastButton);
        } else {
            container.appendChild(button);
        }

        this.updateButtonState();
    }

    createReactButton() {
        const { React } = BdApi;
        const self = this;

        return React.createElement("button", {
            className: "vcf-panel-button",
            "aria-label": "Voice Chat Finder",
            title: "Voice Chat Finder",
            onClick: () => self.showVoiceActivityModal(),
            key: "vcf-button"
        }, React.createElement("svg", {
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "currentColor"
        },
            React.createElement("path", {d: "M12 3a4 4 0 0 0-4 4v5a4 4 0 0 0 8 0V7a4 4 0 0 0-4-4Z"}),
            React.createElement("path", {d: "M6 12a1 1 0 0 0-2 0 8 8 0 0 0 7 7.93V22a1 1 0 1 0 2 0v-2.07A8 8 0 0 0 20 12a1 1 0 1 0-2 0 6 6 0 1 1-12 0Z"})
        ));
    }

    updateButtonState() {
        const button = document.querySelector('.vcf-panel-button');
        if (!button) return;

        const activity = this.getVoiceActivity();
        if (activity.length > 0) {
            button.classList.add('has-activity');
            const total = activity.reduce((sum, s) => sum + s.totalUsers, 0);
            button.title = `Voice Chat Finder - ${total} users in ${activity.length} servers`;
        } else {
            button.classList.remove('has-activity');
            button.title = 'Voice Chat Finder - No activity';
        }
    }

    getVoiceActivity() {
        const { Webpack } = BdApi;
        const GuildStore = Webpack.getStore("GuildStore");
        const VoiceStateStore = Webpack.getStore("VoiceStateStore");
        const ChannelStore = Webpack.getStore("ChannelStore");
        const UserStore = Webpack.getStore("UserStore");
        const RelationshipStore = Webpack.getStore("RelationshipStore");
        const PresenceStore = Webpack.getStore("PresenceStore");

        if (!GuildStore || !VoiceStateStore) {
            console.error('[VoiceChatFinder] Stores not found');
            return [];
        }

        const guilds = Object.values(GuildStore.getGuilds());
        const voiceActivity = [];
        let totalFriends = 0;
        let totalStreaming = 0;

        // Get all voice states - structure is: { guildId: { oderId: voiceState } }
        const rawAllStates = VoiceStateStore.getAllVoiceStates();
        const rawGetStates = VoiceStateStore.getVoiceStates();

        const allVoiceStates = rawAllStates || rawGetStates || {};

        const currentUserId = UserStore?.getCurrentUser()?.id;

        // Process voice states per guild
        for (const guild of guilds) {
            const voiceStates = allVoiceStates[guild.id];
            if (!voiceStates || Object.keys(voiceStates).length === 0) continue;

            const channelData = {};

            for (const [stateKey, state] of Object.entries(voiceStates)) {
                if (!state?.channelId) continue;

                const channel = ChannelStore?.getChannel(state.channelId);
                if (!channel) continue;

                if (!channelData[state.channelId]) {
                    channelData[state.channelId] = {
                        channelId: state.channelId,
                        channelName: channel.name,
                        users: []
                    };
                }

                const oderId = state.userId || stateKey;
                const user = UserStore?.getUser(oderId);

                // Construct avatar URL
                let avatarUrl = null;
                if (user?.avatar) {
                    const ext = user.avatar.startsWith('a_') ? 'gif' : 'webp';
                    avatarUrl = `https://cdn.discordapp.com/avatars/${oderId}/${user.avatar}.${ext}?size=32`;
                }

                // Check if friend (relationship type 1 = friend)
                const isFriend = RelationshipStore?.isFriend(oderId) || false;
                if (isFriend) totalFriends++;

                // Get activity (game/status)
                let activity = null;
                const activities = PresenceStore?.getActivities(oderId);
                if (activities?.length > 0) {
                    // Find game activity (type 0) or custom status
                    const gameActivity = activities.find(a => a.type === 0);
                    const listeningActivity = activities.find(a => a.type === 2);
                    const streamingActivity = activities.find(a => a.type === 1);

                    if (gameActivity) {
                        activity = `Playing ${gameActivity.name}`;
                    } else if (listeningActivity) {
                        activity = `Listening to ${listeningActivity.name}`;
                    } else if (streamingActivity) {
                        activity = `Streaming ${streamingActivity.name}`;
                    }
                }

                // Check streaming/video status from voice state
                const isStreaming = state.selfStream || false;
                const isVideo = state.selfVideo || false;
                if (isStreaming) totalStreaming++;

                channelData[state.channelId].users.push({
                    id: oderId,
                    name: user?.globalName || user?.username || "Unknown User",
                    avatar: avatarUrl,
                    isCurrentUser: oderId === currentUserId,
                    isFriend,
                    activity,
                    isStreaming,
                    isVideo
                });
            }

            const channels = Object.values(channelData);
            if (channels.length > 0) {
                const totalUsers = channels.reduce((sum, ch) => sum + ch.users.length, 0);
                // Construct icon URL manually since getIconURL may not exist
                let guildIcon = null;
                if (guild.icon) {
                    const ext = guild.icon.startsWith('a_') ? 'gif' : 'webp';
                    guildIcon = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${ext}?size=80`;
                }
                voiceActivity.push({
                    guildId: guild.id,
                    guildName: guild.name,
                    guildIcon,
                    channels,
                    totalUsers
                });
            }
        }

        voiceActivity.sort((a, b) => b.totalUsers - a.totalUsers);

        // Attach stats to the result
        voiceActivity.stats = {
            totalFriends,
            totalStreaming
        };

        return voiceActivity;
    }

    navigateToChannel(guildId, channelId) {
        const { Webpack, UI } = BdApi;

        // Get the channel selector module to join voice channels
        const ChannelActions = Webpack.getByKeys("selectVoiceChannel", "selectChannel");
        const NavigationUtils = Webpack.getByKeys("transitionTo", "transitionToGuild");

        // Join the voice channel
        if (ChannelActions?.selectVoiceChannel) {
            ChannelActions.selectVoiceChannel(channelId);
            UI.showToast("Joining voice channel...", { type: "success" });
        } else if (ChannelActions?.selectChannel) {
            ChannelActions.selectChannel(channelId);
            UI.showToast("Joining voice channel...", { type: "success" });
        } else {
            // Fallback: just navigate to the guild/channel
            if (NavigationUtils?.transitionToGuild) {
                NavigationUtils.transitionToGuild(guildId, channelId);
            }
            UI.showToast("Navigating to voice channel...", { type: "info" });
        }
    }

    showVoiceActivityModal() {
        const { React, UI } = BdApi;
        const activity = this.getVoiceActivity();
        const totalUsers = activity.reduce((sum, s) => sum + s.totalUsers, 0);
        const self = this;

        const VoiceIcon = () => React.createElement("svg", {
            width: "20", height: "20", viewBox: "0 0 24 24", fill: "currentColor"
        }, React.createElement("path", {
            d: "M12 3a4 4 0 0 0-4 4v5a4 4 0 0 0 8 0V7a4 4 0 0 0-4-4Z"
        }), React.createElement("path", {
            d: "M6 12a1 1 0 0 0-2 0 8 8 0 0 0 7 7.93V22a1 1 0 1 0 2 0v-2.07A8 8 0 0 0 20 12a1 1 0 1 0-2 0 6 6 0 1 1-12 0Z"
        }));

        const ChannelIcon = () => React.createElement("svg", {
            width: "16", height: "16", viewBox: "0 0 24 24", fill: "currentColor"
        }, React.createElement("path", {
            d: "M11.383 3.07904C11.009 2.92504 10.579 3.01004 10.293 3.29604L6 8.00204H3C2.45 8.00204 2 8.45304 2 9.00204V15.002C2 15.552 2.45 16.002 3 16.002H6L10.293 20.71C10.579 20.996 11.009 21.082 11.383 20.927C11.757 20.772 12 20.407 12 20.002V4.00204C12 3.59904 11.757 3.23204 11.383 3.07904ZM14 5.00195V7.00195C16.757 7.00195 19 9.24595 19 12.002C19 14.758 16.757 17.002 14 17.002V19.002C17.86 19.002 21 15.863 21 12.002C21 8.14295 17.86 5.00195 14 5.00195ZM14 9.00195C15.654 9.00195 17 10.349 17 12.002C17 13.657 15.654 15.002 14 15.002V13.002C14.551 13.002 15 12.553 15 12.002C15 11.451 14.551 11.002 14 11.002V9.00195Z"
        }));

        // Streaming icon
        const StreamingIcon = () => React.createElement("svg", {
            className: "vcf-streaming-icon",
            width: "14", height: "14", viewBox: "0 0 24 24", fill: "currentColor",
            title: "Streaming"
        }, React.createElement("path", {
            d: "M5 4a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h11.28a2 2 0 0 0 1.7-.96l2.5-4a2 2 0 0 0 0-2.08l-2.5-4A2 2 0 0 0 16.28 4H5Z"
        }));

        // Video icon
        const VideoIcon = () => React.createElement("svg", {
            className: "vcf-video-icon",
            width: "14", height: "14", viewBox: "0 0 24 24", fill: "currentColor",
            title: "Camera On"
        }, React.createElement("path", {
            d: "M15 10.5V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-4.5l4.5 3V7.5l-4.5 3Z"
        }));

        const UserChip = ({ user, guildId }) => {
            const openProfile = (e) => {
                e.stopPropagation();
                const { Webpack } = BdApi;
                const UserProfileActions = Webpack.getByKeys("openUserProfileModal", "closeUserProfileModal");

                if (UserProfileActions?.openUserProfileModal) {
                    UserProfileActions.openUserProfileModal({ userId: user.id, guildId });
                } else {
                    const UserPopout = Webpack.getByKeys("fetchProfile");
                    if (UserPopout?.fetchProfile) {
                        UserPopout.fetchProfile(user.id);
                    }
                    BdApi.UI.showToast(`User: ${user.name}`, { type: "info" });
                }
            };

            const chipClasses = [
                'vcf-user-chip',
                user.isCurrentUser ? 'is-me' : '',
                user.isFriend ? 'is-friend' : ''
            ].filter(Boolean).join(' ');

            const tooltip = [
                user.name,
                user.isFriend ? '(Friend)' : '',
                user.activity || '',
                user.isStreaming ? '🔴 Streaming' : '',
                user.isVideo ? '📹 Camera On' : ''
            ].filter(Boolean).join(' • ');

            return React.createElement("div", {
                className: chipClasses,
                onClick: openProfile,
                title: tooltip
            },
                user.avatar
                    ? React.createElement("img", {
                        className: "vcf-user-avatar",
                        src: user.avatar,
                        alt: user.name
                    })
                    : React.createElement("div", {
                        className: "vcf-user-avatar-placeholder"
                    }, user.name.charAt(0).toUpperCase()),
                React.createElement("div", { className: "vcf-user-info" },
                    React.createElement("span", { className: "vcf-user-name" },
                        user.name,
                        user.isCurrentUser && React.createElement("span", { className: "vcf-me-badge" }, "Me"),
                        !user.isCurrentUser && user.isFriend && React.createElement("span", { className: "vcf-friend-badge" }, "Friend")
                    ),
                    user.activity && React.createElement("span", { className: "vcf-activity" }, user.activity)
                ),
                (user.isStreaming || user.isVideo) && React.createElement("div", { className: "vcf-user-icons" },
                    user.isStreaming && React.createElement(StreamingIcon),
                    user.isVideo && React.createElement(VideoIcon)
                )
            );
        };

        const ExpandIcon = ({ expanded }) => React.createElement("svg", {
            className: `vcf-expand-icon ${expanded ? 'expanded' : ''}`,
            width: "12", height: "12", viewBox: "0 0 24 24", fill: "currentColor"
        }, React.createElement("path", {
            d: "M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.41 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.7 6.7a1 1 0 0 0-1.41.01Z"
        }));

        const ChannelItem = ({ channel, guildId }) => {
            const [showUsers, setShowUsers] = React.useState(false);

            return React.createElement("div", { key: channel.channelId },
                React.createElement("div", {
                    className: `vcf-channel-header ${showUsers ? 'has-users' : 'collapsed'}`,
                    onClick: () => setShowUsers(!showUsers)
                },
                    React.createElement(ExpandIcon, { expanded: showUsers }),
                    React.createElement(ChannelIcon),
                    React.createElement("span", { className: "vcf-channel-name" }, channel.channelName),
                    React.createElement("span", { className: "vcf-channel-count" }, channel.users.length),
                    React.createElement("button", {
                        className: "vcf-join-btn",
                        onClick: (e) => {
                            e.stopPropagation();
                            self.navigateToChannel(guildId, channel.channelId);
                        }
                    }, "Join")
                ),
                showUsers && React.createElement("div", { className: "vcf-channel-users" },
                    channel.users.map(user =>
                        React.createElement(UserChip, { key: user.id, user, guildId })
                    )
                )
            );
        };

        const ServerItem = ({ server }) => {
            const [expanded, setExpanded] = React.useState(false);

            return React.createElement("div", null,
                React.createElement("div", {
                    className: "vcf-server-item",
                    onClick: () => setExpanded(!expanded)
                },
                    server.guildIcon
                        ? React.createElement("img", {
                            className: "vcf-server-icon",
                            src: server.guildIcon,
                            alt: server.guildName
                        })
                        : React.createElement("div", {
                            className: "vcf-server-icon-placeholder"
                        }, server.guildName.charAt(0).toUpperCase()),
                    React.createElement("div", { className: "vcf-server-info" },
                        React.createElement("div", { className: "vcf-server-name" }, server.guildName),
                        React.createElement("div", { className: "vcf-channel-summary" },
                            `${server.channels.length} channel${server.channels.length !== 1 ? 's' : ''} active`
                        )
                    ),
                    React.createElement("div", { className: "vcf-user-count" },
                        React.createElement(VoiceIcon),
                        server.totalUsers
                    )
                ),
                expanded && React.createElement("div", { className: "vcf-channels-dropdown" },
                    server.channels.map(channel =>
                        React.createElement(ChannelItem, {
                            key: channel.channelId,
                            channel,
                            guildId: server.guildId
                        })
                    )
                )
            );
        };

        // Modal with search functionality
        const ModalContent = () => {
            const [searchQuery, setSearchQuery] = React.useState('');
            const [activeFilter, setActiveFilter] = React.useState(null); // null, 'friends', 'streaming'

            // Toggle filter on click
            const toggleFilter = (filter) => {
                setActiveFilter(activeFilter === filter ? null : filter);
            };

            // Filter servers and users based on search AND active filter
            let filteredActivity = searchQuery.trim() === '' ? activity : activity.map(server => {
                const query = searchQuery.toLowerCase();
                const serverMatches = server.guildName.toLowerCase().includes(query);

                // Filter channels that have matching users or channel names
                const filteredChannels = server.channels.map(channel => {
                    const channelMatches = channel.channelName.toLowerCase().includes(query);
                    const filteredUsers = channel.users.filter(user =>
                        user.name.toLowerCase().includes(query) ||
                        (user.activity && user.activity.toLowerCase().includes(query))
                    );

                    if (channelMatches || filteredUsers.length > 0) {
                        return { ...channel, users: channelMatches ? channel.users : filteredUsers };
                    }
                    return null;
                }).filter(Boolean);

                if (serverMatches || filteredChannels.length > 0) {
                    return {
                        ...server,
                        channels: serverMatches ? server.channels : filteredChannels,
                        totalUsers: serverMatches
                            ? server.totalUsers
                            : filteredChannels.reduce((sum, ch) => sum + ch.users.length, 0)
                    };
                }
                return null;
            }).filter(Boolean);

            // Apply friends/streaming filter
            if (activeFilter === 'friends') {
                filteredActivity = filteredActivity.map(server => {
                    const filteredChannels = server.channels.map(channel => {
                        // Include friends AND yourself
                        const friendUsers = channel.users.filter(user => user.isFriend || user.isCurrentUser);
                        if (friendUsers.length > 0) {
                            return { ...channel, users: friendUsers };
                        }
                        return null;
                    }).filter(Boolean);

                    if (filteredChannels.length > 0) {
                        return {
                            ...server,
                            channels: filteredChannels,
                            totalUsers: filteredChannels.reduce((sum, ch) => sum + ch.users.length, 0)
                        };
                    }
                    return null;
                }).filter(Boolean);
            } else if (activeFilter === 'streaming') {
                filteredActivity = filteredActivity.map(server => {
                    const filteredChannels = server.channels.map(channel => {
                        const streamingUsers = channel.users.filter(user => user.isStreaming);
                        if (streamingUsers.length > 0) {
                            return { ...channel, users: streamingUsers };
                        }
                        return null;
                    }).filter(Boolean);

                    if (filteredChannels.length > 0) {
                        return {
                            ...server,
                            channels: filteredChannels,
                            totalUsers: filteredChannels.reduce((sum, ch) => sum + ch.users.length, 0)
                        };
                    }
                    return null;
                }).filter(Boolean);
            }

            const stats = activity.stats || { totalFriends: 0, totalStreaming: 0 };

            return React.createElement("div", { className: "vcf-modal-content" },
                // Header
                React.createElement("div", { className: "vcf-header" },
                    React.createElement("div", { className: "vcf-header-icon" },
                        React.createElement(VoiceIcon)
                    ),
                    React.createElement("div", { className: "vcf-header-text" },
                        React.createElement("h2", null, "Voice Activity"),
                        React.createElement("p", null,
                            activity.length > 0
                                ? `${totalUsers} user${totalUsers !== 1 ? 's' : ''} in ${activity.length} server${activity.length !== 1 ? 's' : ''}`
                                : "No active voice channels"
                        )
                    )
                ),
                // Stats bar (clickable filters)
                activity.length > 0 && React.createElement("div", { className: "vcf-stats-bar" },
                    React.createElement("div", {
                        className: `vcf-stat ${activeFilter === 'friends' ? 'active' : ''}`,
                        onClick: () => toggleFilter('friends'),
                        title: "Click to filter by friends in voice chat"
                    },
                        "👥 Friends in VC: ",
                        React.createElement("span", { className: "vcf-stat-value" }, stats.totalFriends)
                    ),
                    React.createElement("div", {
                        className: `vcf-stat ${activeFilter === 'streaming' ? 'active' : ''}`,
                        onClick: () => toggleFilter('streaming'),
                        title: "Click to filter by users who are streaming"
                    },
                        "🔴 Streaming: ",
                        React.createElement("span", { className: "vcf-stat-value" }, stats.totalStreaming)
                    )
                ),
                // Search bar
                activity.length > 0 && React.createElement("div", { className: "vcf-search-container" },
                    React.createElement("input", {
                        className: "vcf-search-input",
                        type: "text",
                        placeholder: "Search servers, channels, users, or games...",
                        value: searchQuery,
                        onChange: (e) => setSearchQuery(e.target.value)
                    })
                ),
                // Content
                filteredActivity.length === 0
                    ? React.createElement("div", { className: "vcf-no-activity" },
                        React.createElement(VoiceIcon),
                        React.createElement("div", { className: "vcf-no-activity-text" },
                            activeFilter === 'friends' ? "No friends are currently in voice chat."
                            : activeFilter === 'streaming' ? "No one is currently streaming."
                            : searchQuery ? "No results found."
                            : "No servers have active voice channels right now."
                        )
                    )
                    : filteredActivity.map(server =>
                        React.createElement(ServerItem, { key: server.guildId, server })
                    )
            );
        };

        const modalContent = React.createElement(ModalContent);

        UI.showConfirmationModal("Voice Chat Finder", modalContent, {
            confirmText: "Refresh",
            cancelText: "Close",
            onConfirm: () => this.showVoiceActivityModal()
        });
    }

    getSettingsPanel() {
        const container = document.createElement("div");
        container.style.padding = "16px";

        const description = document.createElement("p");
        description.innerHTML = `
            <strong>Voice Chat Finder v2.0</strong><br><br>
            This plugin adds a microphone button to your user panel (next to mute/deafen).<br><br>
            <strong>Features:</strong><br>
            • Click the button to see all servers with active voice channels<br>
            • Green indicator shows when there's voice activity<br>
            • Click a server to expand channels or jump directly<br>
            • Sorted by most active servers first
        `;
        description.style.cssText = "color: var(--text-normal); font-size: 14px; line-height: 1.6;";
        container.appendChild(description);

        const scanButton = document.createElement("button");
        scanButton.textContent = "Open Voice Chat Finder";
        scanButton.style.cssText = `
            margin-top: 16px;
            padding: 10px 20px;
            background: var(--brand-experiment);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
        `;
        scanButton.onclick = () => this.showVoiceActivityModal();
        container.appendChild(scanButton);

        return container;
    }
};
