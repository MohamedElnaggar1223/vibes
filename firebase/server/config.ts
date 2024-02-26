'use server'
import admin from 'firebase-admin'

type FirebaseAdminAppParams = {
    projectId: string,
    clientEmail: string,
    privateKey: string
}

function formatPrivateKey(key: string){
    return key.replace(/\\n/g, '\n')
}

export async function createFirebaseAdminApp(params: FirebaseAdminAppParams){
    const privateKey = formatPrivateKey(params.privateKey)

    if(admin.apps.length > 0) return admin.app()

    const cert = admin.credential.cert({
        projectId: params.projectId,
        clientEmail: params.clientEmail,
        privateKey
    })

    return admin.initializeApp({
        credential: cert,
        projectId: params.projectId,
    })
}

export async function initAdmin() {
    const params = {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PROJECT_ID!,
        clientEmail: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_CLIENT_EMAIL!,
        privateKey: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PRIVATE_KEY!
    }

    return createFirebaseAdminApp(params)
}