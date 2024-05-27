import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextRequest } from 'next/server';

type Params = {
	kindeAuth: string;
};

export async function GET(request: NextRequest, { params }: { params: Params }) {
	const endpoint = params.kindeAuth;
	return handleAuth(request, endpoint);
}
