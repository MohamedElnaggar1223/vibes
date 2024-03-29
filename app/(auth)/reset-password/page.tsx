import ResetPassword from "@/components/auth/reset-password/ResetPassword"

type Props = {
	searchParams: { [key: string]: string | string[] | undefined }
}

export default async function ResetPasswordPage({ searchParams }: Props) 
{
    return <ResetPassword />
}