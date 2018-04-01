import ViewController from '~/controllers/ViewController';
import MarkdownViewController from '~/controllers/MarkdownViewController';
import * as MarkdownControls from '~/controllers/MarkdownControls';

import Comment from '~/models/Request/Comment';
import Answer from '~/models/Answer';
import Post from '~/models/Post';

export const CommentError = Symbol('WriteComment.Error.submit');
export const CommentOwnerTypeError = Symbol('WriteComment.Error.ownerType');

export const CommentLengthBounds = [
    process.env.MIN_COMMENT_LENGTH,
    process.env.MAX_COMMENT_LENGTH
];

export const CommentLengthBounds = [
    process.env.MIN_COMMENT_LENGTH,
    process.env.MAX_COMMENT_LENGTH
];

export const CommentLengthBounds = [
    process.env.MIN_COMMENT_LENGTH,
    process.env.MAX_COMMENT_LENGTH
];

/**
 * Manages a "Write Comment" button
 */
export default class WriteCommentViewController extends ViewController {
    /**
     * Creates the write commemt button
     * @param {HTMLElement} button The <a> init tag.
     * @param {Post|Answer} owner The owner
     * @param {CommentListViewController} parentList The list view which to place comment in.
     */
    constructor(button, owner, parentList) {
        super(button);

        this._node = button;

        this._commentText = <textarea placeholder="Your comment..." class="markdown shrink text-base comment-body" name="comment-body" type="text"></textarea>;


        this._cancel = <a class="cancel">cancel</a>;
        this._submit = <a class="submit button accent">submit</a>;
        this._writingBox = (
            <div class="comment-writer">
                <h5>Write Comment</h5>
                { this._commentText }
                <div class="comment-submit">
                    <span class="info">Must be between {CommentLengthBounds[0]} and {CommentLengthBounds[1]} characters.</span>
                    { this._cancel }
                    { this._submit }
                </div>
            </div>
        );

        // Setup markdown
        new MarkdownViewController(this._commentText, [
            new MarkdownControls.MarkdownBoldControl(),
            new MarkdownControls.MarkdownItalicControl(),
            new MarkdownControls.MarkdownStrikethroughControl()
        ]);

        this._displayingWritingBox = false;

        /** @type {Post|Answer} */
        this.owner = owner;

        /** @type {CommentListViewController} */
        this.parentList = parentList;

        this._node.addEventListener("click", ::this.toggleState);
        this._cancel.addEventListener("click", ::this.toggleState);

        this._submit.addEventListener("click", () => {
            this.submit()
                .catch((error) => ErrorManager.report(error));
        });
    }

    /**
     * Submits this form
     */
    async submit() {
        const text = this._commentText.value;
        if (text < CommentLengthBounds[0] || text > CommentLengthBounds[1]) {
            // Display error message
            return;
        }

        this.toggleState();

        let type;
        if (this.owner instanceof Answer) type = 'answer';
        else if (this.owner instanceof Post) type = 'post';
        else ErrorManager.shared.raise(`Unexpected comment owner type`, CommentOwnerTypeError);

        let instance = this.parentList.createLoadingInstance();

        try {
            let commentPost = new Comment({
                type: type,
                id: this.owner.id,
                value: text
            });

            const comment = await commentPost.send();

            // Reset the box
            this._commentText.value = "";

            this.parentList.createCommentInstance(comment);
        } catch (error) {
            // TODO: handle error
            let errorMessage = {
                [400]: `Internal error in comment layout`,
                [401]: `You must be authorized to vote`,
                [500]: `Internal server error.`,
            }[error.response?.status] || `Unexpected error posting comment.`;

            this.parentList.createErrorInstance(errorMessage);
            ErrorManager.silent(error, errorMessage);
        } finally {
            instance.destroy();
        }
    }

    /**
     * Toggles between writing box and "add comment" dialogue.
     */
    toggleState() {
        if (this._displayingWritingBox) {
            this._writingBox.parentNode.replaceChild(this._node, this._writingBox);
            this._displayingWritingBox = false;
        } else {
            this._node.parentNode.replaceChild(this._writingBox, this._node);
            this._displayingWritingBox = true;
        }
    }
}
