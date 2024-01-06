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
      <div className="card bg-neutral text-neutral-content items-center w-full">
        <div className="card-body">
          <div className="">12月の利用料金</div>
          <h2 className="card-title center">&yen;{yen}</h2>
        </div>
      </div>
      <div className="w-full items-center">
        <ul className="flex flex-wrap gap-8">
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
