import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [
    { title: "Z物販" },
    { name: "description", content: "Z物販の購入画面です" },
  ];
};

type Data = {
  id: string;
  name: string;
  price: number;
}

const mockData: Array<Data> = [
  {
    id: "1111",
    name: "コカ・コーラ",
    price: 140,
  },
  {
    id: "222",
    name: "炭酸水",
    price: 100,
  },
  {
    id: "3",
    name: "MAXCOFFEE",
    price: 90,
  },
  {
    id: "4",
    name: "カップスープの素",
    price: 60,
  },
  {
    id: "5",
    name: "ガラナ500ml",
    price: 140,
  },
  {
    id: "6",
    name: "ウーロン茶",
    price: 80,
  },
  {
    id: "7",
    name: "三ツ矢サイダー",
    price: 110,
  },
  {
    id: '8',
    name: "水",
    price: 70,
  }
];

export default function Index() {
  const yen = 800;
  return (
    <>
      <div className="w-full flex items-center justify-center m-3">
        <div className="stat w-32">
          <h2 className="stat-title">12月の利用料金</h2>
          <p className="stat-value">&yen;{yen}</p>
        </div>
      </div>
      <div className="w-full pt-3">
        <ul className="flex flex-wrap gap-8 justify-center">
          {mockData.map((data) => (
            <li className="card w-64 bg-base-100 shadow-xl" key={data.id}>
              <div className="card-body">
                <div className="card-title">{data.name}</div>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">&yen;{data.price}</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
