/**
 * Analytics wrapper
 */
export default class Analytics {
    /**
     * The object to create from which. Returns `null` if invalid
     * @param {Object} obj Generally `gtag`
     */
    constructor(obj) {
        if (!obj) return null;

        /** @private */
        this.gtag = obj;
    }

    /**
     * Reports an event of type
     * @param {string} eventName An additional descriptor name
     * @param {EventType} eventType An EventType symbol
     * @param {?string} label a string describing event
     * @param {?number} id unique number
     */
    report(eventType, label = null, id = null) {
        const eventObject = {};

        if (typeof label == 'number' || id) {
            eventObject.value = id || label;
        }

        if (typeof label == 'string') {
            eventObject.event_label = label;
        }

        eventObject.event_category = eventType.category;
        this.gtag('event', eventType.name, eventObject);
    }

    /**
     * Reports a time of sorts
     * @param {TimingType} timingTime An TimingType symbol
     * @param {number} id time in MS
     */
    reportTime(timingType, id) {
        let timingObject = Object.create(timingType);
        timingObject.value = id;
        this.gtag('event', 'timing_complete', timingObject);
    }

    static shared = new Analytics(window.gtag);
}

export const EventCategory = {
    engagement: 'engagement',
    userManagement: 'user_management',
    socialEngagement: 'social_engagement',
    vote: 'vote'
};

export const EventType = {
    loginOpen: {
        category: EventCategory.userManagement,
        name: 'login_open'
    },
    loginMethod: {
        category: EventCategory.userManagement,
        name: 'login_method'
    },

    comment: {
        category: EventCategory.socialEngagement,
        name: 'comment'
    },

    postVote: {
        category: EventCategory.vote,
        name: 'post_vote'
    },
    answerVote: {
        category: EventCategory.vote,
        name: 'answer_vote'
    }
};

export const TimingType = {
    pageLoad: {
        name: 'load'
    }
};