/**
 * @swagger
 * tags:
 *   - name: Comments
 *     description: Comments management APIs
 */

/**
 * @swagger
 * /comments/addComment:
 *  post:
 *     tags:
 *       - Comments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 example: any
 *               segment_id:
 *                 example: any
 *               seq_no:
 *                 example: any
 *               comments_text:
 *                 example: any
 *               audio_path:
 *                 example: any
 *             required:
 *               - user_id
 *               - segment_id
 *               - comments_text
 *               - audio_path
 *     responses:
 *       '200':
 *         description: Success
 *       '201':
 *         description: Created
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Server Error
 */

/**
 * @swagger
 * /comments/addReplies:
 *  post:
 *     tags:
 *       - Comments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 example: any
 *               comment_id:
 *                 example: any
 *               seq_no:
 *                 example: any
 *               reply_text:
 *                 example: any
 *               audio_path:
 *                 example: any
 *             required:
 *               - user_id
 *               - comment_id
 *               - reply_text
 *               - audio_path
 *     responses:
 *       '200':
 *         description: Success
 *       '201':
 *         description: Created
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Server Error
 */