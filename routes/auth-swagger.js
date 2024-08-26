/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Auth management APIs
 */

/**
 * @swagger
 * /auth/adminLogin:
 *  post:
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mailId:
 *                 example: any
 *               password:
 *                 example: any
 *             required:
 *               - mailId
 *               - password
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