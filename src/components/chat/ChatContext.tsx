import { ChangeEvent, createContext, FC, PropsWithChildren, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';

type StreamResponse = {
	addMessage: () => void;
	message: string;
	handleInputChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
	isLoading: boolean;
};

export const ChatContext = createContext<StreamResponse>({
	addMessage: () => {},
	message: '',
	handleInputChange: () => {},
	isLoading: false,
});

interface ChatInputProps {
	fileId: string;
}

export const ChatContextProvider: FC<PropsWithChildren<ChatInputProps>> = ({
	fileId,
	children,
}) => {
	const [message, setMessage] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { toast } = useToast();

	const { mutate: sendMessage } = useMutation({
		mutationFn: async ({ message }: { message: string }) => {
			const response = await fetch('/api/message', {
				method: 'POST',
				body: JSON.stringify({
					fileId,
					message,
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to send message');
			}

			return response.body;
		},
	});

	const addMessage = () => sendMessage({ message });

	const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(e.target.value);
	};

	return (
		<ChatContext.Provider value={{ addMessage, message, handleInputChange, isLoading }}>
			{children}
		</ChatContext.Provider>
	);
};
