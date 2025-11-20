import {createAuthClient} from "better-auth/react"
import {inferAdditionalFields} from "better-auth/client/plugins";


// export const authClient = createAuthClient({
//     /** The base URL of the server (optional if you're using the same domain) */
//     baseURL: "http://localhost:3000"
// })

export const {signIn, signUp, signOut, useSession, getSession} = createAuthClient({
    plugins: [
        inferAdditionalFields({
            user: {
                description: {
                    type: 'string',
                    required: false,
                    default: "Hi I'm new here!"
                },
                role: {
                    type: "string",
                    required: false,
                    default: "user"
                }
            }
        })
    ]
});