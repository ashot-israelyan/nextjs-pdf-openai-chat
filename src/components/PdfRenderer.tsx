'use client';

import { ChevronDown, ChevronUp, Loader2, RotateCcw, Search } from 'lucide-react';
import { FC, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useResizeDetector } from 'react-resize-detector';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useToast } from './ui/use-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PdfRendererProps {
	url: string;
}

const PdfRenderer: FC<PdfRendererProps> = ({ url }) => {
	const [numPages, setNumPages] = useState<number>();
	const [currPage, setCurrPage] = useState<number>(1);
	const [scale, setScale] = useState<number>(1);
	const [rotation, setRotation] = useState<number>(0);
	const [renderedScale, setRenderedScale] = useState<number | null>(null);

	const { toast } = useToast();
	const { width, ref } = useResizeDetector();

	const isLoading = renderedScale !== scale;

	const CustomPageValidator = z.object({
		page: z.string().refine((num) => Number(num) > 0 && Number(num) <= numPages!),
	});

	type TCustomPageValidator = z.infer<typeof CustomPageValidator>;

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<TCustomPageValidator>({
		defaultValues: {
			page: '1',
		},
		resolver: zodResolver(CustomPageValidator),
	});

	const handlePageSubmit = ({ page }: TCustomPageValidator) => {
		setCurrPage(Number(page));
		setValue('page', String(page));
	};

	return (
		<div className="w-full bg-white rounded-md shadow flex flex-col items-center">
			<div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
				<div className="flex items-center gap-1.5">
					<Button
						disabled={numPages === undefined || currPage <= 1}
						variant="ghost"
						aria-label="previous page"
						onClick={() => {
							setCurrPage((prev) => (prev - 1 >= 1 ? prev - 1 : prev));
							setValue('page', String(currPage - 1));
						}}
					>
						<ChevronDown className="h-4 w-4" />
					</Button>

					<div className="flex items-center gap-1.5">
						<Input
							{...register('page')}
							className={cn('w-12 h-8', errors.page && 'focus-visible:ring-red-500')}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									handleSubmit(handlePageSubmit)();
								}
							}}
						/>
						<p className="text-zinc-700 text-small space-x-1">
							<span>/</span>
							<span>{numPages ?? 'x'}</span>
						</p>
					</div>

					<Button
						disabled={numPages === undefined || currPage === numPages}
						variant="ghost"
						aria-label="next page"
						onClick={() => {
							setCurrPage((prev) => (prev + 1 > numPages! ? numPages! : prev + 1));
							setValue('page', String(currPage + 1));
						}}
					>
						<ChevronUp className="h-4 w-4" />
					</Button>
				</div>

				<div className="space-x-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button className="gap-1.5" aria-label="zoom" variant="ghost">
								<Search className="h-4 w-4" />
								{scale * 100}%
								<ChevronDown className="h-3 w-3 opacity-50" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem onSelect={() => setScale(1)}>100%</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => setScale(1.5)}>150%</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => setScale(2)}>200%</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => setScale(2.5)}>250%</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<Button
						onClick={() => setRotation((prev) => prev + 90)}
						variant="ghost"
						aria-label="rotate 90 degrees"
					>
						<RotateCcw className="h-4 w-4" />
					</Button>
				</div>
			</div>

			<div className="flex-1 w-full max-h-screen">
				<div ref={ref}>
					<Document
						loading={
							<div className="flex justify-center">
								<Loader2 className="my-24 h-6 w-6 animate-spin" />
							</div>
						}
						onLoadError={() => {
							toast({
								title: 'Error',
								description: 'Please try again later',
								variant: 'destructive',
							});
						}}
						onLoadSuccess={({ numPages }) => setNumPages(numPages)}
						file={url}
						className="max-h-full"
					>
						<Page width={width ? width : 1} pageNumber={currPage} />
					</Document>
				</div>
			</div>
		</div>
	);
};

export default PdfRenderer;
