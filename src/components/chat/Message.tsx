import { ExtendedMessage } from '@/types/message';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface MessageProps {
	message: ExtendedMessage;
	isNextMessageSamePerson: boolean;
}

const Message = forwardRef<HTMLDivElement, MessageProps>(
	({ message, isNextMessageSamePerson }, ref) => {
		return (
			<div
				ref={ref}
				className={cn('flex items-end', {
					'justify-end': message.isUserMessage,
				})}
			></div>
		);
	},
);

Message.displayName = 'Message';

export default Message;
