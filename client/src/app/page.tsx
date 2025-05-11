import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Home() {
  return (
    <div className="relative container min-h-[1000px] px-40 py-8">
      <div className="chat flex flex-col gap-4">
        {/* Card Bot */}
        <Card className="max-w-1/2">
          <CardContent>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla
              animi ad delectus. Non inventore nemo sequi. Distinctio assumenda
              aspernatur quo saepe omnis, debitis quis nisi recusandae, corporis
              in, tenetur voluptatem facere ipsam? Deleniti quam maiores
              debitis! Numquam perferendis quam ad repudiandae, nulla a neque
              pariatur reprehenderit natus. Tempore quaerat, adipisci corrupti
              possimus non aspernatur ab fugiat laboriosam dignissimos
              accusantium esse? Nisi ipsam, necessitatibus accusantium atque
              officiis minus voluptates voluptatem a id rerum ratione quibusdam
              maxime quam vero aliquam, nam mollitia, omnis eaque porro! Minima
              quod, nostrum quam, rem voluptate voluptatibus error reiciendis ad
              est magnam veritatis nam deleniti ipsum rerum.
            </p>
          </CardContent>
        </Card>

        {/* Card User */}
        <Card className="max-w-1/2">
          <CardContent>
            <p>User</p>
          </CardContent>
        </Card>
      </div>

      {/* Input dan Button Fixed di bawah */}
      <div className="fixed right-0 bottom-0 left-0 flex items-center gap-4 bg-white p-8 px-40">
        <Input
          type="text"
          className="w-full rounded-xl p-8"
          placeholder="Tanya tentang satua Bali"
        />
        <Button className="rounded-xl p-8" variant="outline" size="icon">
          <Search />
        </Button>
      </div>
    </div>
  );
}
