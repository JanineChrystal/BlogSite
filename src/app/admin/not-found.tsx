"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFoundPage() {
	// Game state variables
	const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
	const [isXNext, setIsXNext] = useState<boolean>(true); // User is 'X', Bot is 'O'
	const [winner, setWinner] = useState<string | null>(null);
	const [isDraw, setIsDraw] = useState<boolean>(false);

	// Check for win or draw conditions
	useEffect(() => {
		const lines = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8], // Rows
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8], // Columns
			[0, 4, 8],
			[2, 4, 6], // Diagonals
		];

		let roundWon = false;
		for (const line of lines) {
			const [a, b, c] = line;
			if (board[a] && board[a] === board[b] && board[a] === board[c]) {
				setWinner(board[a]);
				roundWon = true;
				break;
			}
		}

		if (!roundWon && board.every((cell) => cell !== null)) {
			setIsDraw(true);
		}
	}, [board]);

	// Simple Bot logic automated response
	useEffect(() => {
		if (!isXNext && !winner && !isDraw) {
			// slight delay to the bot to feel like it is "thinking"
			const timer = setTimeout(() => {
				const emptyIndices = board
					.map((val, idx) => (val === null ? idx : null))
					.filter((val) => val !== null) as number[];

				if (emptyIndices.length > 0) {
					// Random choice strategy for low UI bot
					const randomIndex =
						emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
					const newBoard = [...board];
					newBoard[randomIndex] = "O";
					setBoard(newBoard);
					setIsXNext(true);
				}
			}, 400);

			return () => clearTimeout(timer);
		}
	}, [isXNext, board, winner, isDraw]);

	// User click handler
	const handleClick = (index: number) => {
		if (board[index] || winner || isDraw || !isXNext) return;

		const newBoard = [...board];
		newBoard[index] = "X";
		setBoard(newBoard);
		setIsXNext(false);
	};

	// Reset game interface
	const resetGame = () => {
		setBoard(Array(9).fill(null));
		setIsXNext(true);
		setWinner(null);
		setIsDraw(false);
	};

	return (
		<main className="w-full min-h-screen flex flex-col items-center justify-center px-6 py-8 text-center">
			<h2 className="text-3xl font-bold text-slate-900 mb-2">
				404 - Page Not Found
			</h2>
			<p className="text-slate-600 max-w-md mb-8">
				Oops! The page you are looking for does not exist. While you're here,
				how about a quick game?
			</p>

			{/* Tic-Tac-Toe Low UI Container */}
			<div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-sm w-full mb-6 shadow-sm">
				<div className="flex justify-between items-center mb-4">
					<p className="text-xs font-mono uppercase tracking-wider text-slate-500">
						{winner
							? `Winner: ${winner}`
							: isDraw
								? "It's a Draw!"
								: isXNext
									? "Your Turn (X)"
									: "Bot Thinking (O)..."}
					</p>
					<button
						type="reset"
						onClick={resetGame}
						className="text-xs font-bold text-slate-500 hover:text-slate-800 underline"
					>
						Clear Board
					</button>
				</div>

				{/* Grid Board */}
				<div className="grid grid-cols-3 gap-2 bg-slate-200 p-2 rounded-xl">
					{board.map((cell, idx) => (
						<button
							type="button"
							// biome-ignore lint/suspicious/noArrayIndexKey: board is fixed-size (9 cells), positions never reorder
							key={`ttt-cell-${idx}`}
							onClick={() => handleClick(idx)}
							className="h-20 bg-white rounded-lg flex items-center justify-center text-2xl font-mono font-bold transition-colors hover:bg-slate-50 disabled:opacity-100"
							disabled={cell !== null || !isXNext || !!winner || isDraw}
						>
							<span
								className={cell === "X" ? "text-slate-900" : "text-slate-400"}
							>
								{cell}
							</span>
						</button>
					))}
				</div>
			</div>

			{/* Main Application Reset Escape Button */}
			<Link
				href="/admin/dashboard"
				className="px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
			>
				Back to Dashboard
			</Link>
		</main>
	);
}
