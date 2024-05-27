'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Button } from './ui/button';

const UploadButton = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(v) => {
				if (!v) {
					setIsOpen(v);
				}
			}}
		>
			<DialogTrigger asChild onClick={() => setIsOpen(true)}>
				<Button>Upload PDF</Button>
			</DialogTrigger>

			<DialogContent>example content</DialogContent>
		</Dialog>
	);
};

export default UploadButton;
