import VoteViewController from '~/controllers/VoteViewController';
import PostVote from '~/models/Request/PostVote';
import Analytics, { EventType } from '~/models/Analytics';

/**
 * Voting on answers
 */
export default class PostVoteViewController extends VoteViewController {

    /**
     * Creates an answer view controller
     * @param {HTMLElement} voteButton
     * @param {Object} opts
     * @param {string} opts.voteType
     * @param {number} opts.postId
     */
    constructor(voteButton, { voteType, postId }) {
        super(voteButton, voteType);
        this._postId = postId;
    }

    /** @override */
    getRequest(voteType, isAdding) {
        Analytics.shared?.report(EventType.postVote, +this._postId);
        return new PostVote({
            postId: this._postId,
            voteType: voteType,
            isAdding: isAdding
        });
    }
}
