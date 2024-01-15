export const meta = () => [
	{ title: "認証メール送信 | Z物販" },
	{ name: "description", content: "認証メールを確認してください" },
];

export default function Wait() {
	return (
		<div className="h-screen flex justify-center items-center">
			<div className="card card-bordered bg-base-100 shadow-xl">
				<div className="card-body items-center text-center">
					<h2 className="card-title">認証メールを確認してください</h2>
					<p className="text-base-content">
						メールが届かない場合は、迷惑メールフォルダを確認してください。
					</p>
				</div>
			</div>
		</div>
	);
}
