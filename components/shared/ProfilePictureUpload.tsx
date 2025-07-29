'use client'

import { useState, useRef } from 'react'
import { storage } from '@/firebase/client/config'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { User } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import Image from 'next/image'
import { cn } from '@/lib/utils'

type Props = {
    currentProfilePicture?: string
    onProfilePictureChange: (url: string | null) => void
    userId: string
    isLoading: boolean
    className?: string
}

export default function ProfilePictureUpload({
    currentProfilePicture,
    onProfilePictureChange,
    userId,
    isLoading,
    className
}: Props) {
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()

    const uploadProfilePicture = async (file: File) => {
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast({
                title: "Error",
                description: "Please select a valid image file",
                variant: "destructive",
            })
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "Error",
                description: "Image size should be less than 5MB",
                variant: "destructive",
            })
            return
        }

        setUploading(true)
        try {
            // Delete existing profile picture if it exists
            if (currentProfilePicture) {
                await removeProfilePicture()
            }

            // Create reference for the new file
            const fileExtension = file.name.split('.').pop()
            const fileName = `profile-pictures/${userId}.${fileExtension}`
            const storageRef = ref(storage, fileName)

            // Upload file
            await uploadBytes(storageRef, file)
            const downloadURL = await getDownloadURL(storageRef)

            onProfilePictureChange(downloadURL)
            toast({
                title: "Success",
                description: "Profile picture uploaded successfully!",
                variant: "default",
            })
        } catch (error) {
            console.error('Upload error:', error)
            toast({
                title: "Error",
                description: "Failed to upload profile picture",
                variant: "destructive",
            })
        } finally {
            setUploading(false)
        }
    }

    const removeProfilePicture = async () => {
        if (!currentProfilePicture) return

        try {
            // Extract the path from the URL to create a reference
            const pathMatch = currentProfilePicture.match(/o\/(.*?)\?/)
            if (pathMatch) {
                const path = decodeURIComponent(pathMatch[1])
                const storageRef = ref(storage, path)
                await deleteObject(storageRef)
            }

            onProfilePictureChange(null)
            toast({
                title: "Success",
                description: "Profile picture removed successfully!",
                variant: "default",
            })
        } catch (error) {
            console.error('Remove error:', error)
            toast({
                title: "Error",
                description: "Failed to remove profile picture",
                variant: "destructive",
            })
        }
    }

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            uploadProfilePicture(file)
        }
    }

    const openFileDialog = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className={cn("flex flex-col items-center gap-4", className)}>
            <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                    {currentProfilePicture ? (
                        <Image
                            src={currentProfilePicture}
                            alt="Profile"
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <User className="w-12 h-12 text-gray-400" />
                    )}
                </div>
                {(uploading || isLoading) && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={openFileDialog}
                    disabled={uploading || isLoading}
                    className="px-4 py-2 bg-gradient-to-r from-[#E72377] to-[#EB5E1B] text-white text-sm rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {uploading ? 'Uploading...' : currentProfilePicture ? 'Change Picture' : 'Upload Picture'}
                </button>

                {currentProfilePicture && (
                    <button
                        type="button"
                        onClick={removeProfilePicture}
                        disabled={uploading || isLoading}
                        className="px-4 py-2 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Remove
                    </button>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />
        </div>
    )
} 