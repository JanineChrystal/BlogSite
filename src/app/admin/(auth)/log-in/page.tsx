import { LoginForm } from "@/app/admin/(auth)/components/LoginForm";

export default function LoginPage() {
	return (
		<div className="w-full max-w-sm">
			<h1 className="mb-8 text-center font-heading text-headline-md text-on-surface">
				Chrystl.Blogs
				<span className="mt-1 block text-body-md font-normal text-on-surface-variant">
					Admin
				</span>
			</h1>
			<LoginForm />
		</div>
	);
}
