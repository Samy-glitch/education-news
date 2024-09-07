import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserContext } from "@/context/authContext";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Order {
  id: string;
  userUID: string;
  state: string;
  bookName: string;
  bookImage: string;
  bookID: string;
  bookPrice: string;
  [key: string]: any;
}

const Orders = () => {
  const { user } = useUserContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const skeletonItems = Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
  }));

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.email) {
        const orderRef = collection(db, "orders");
        const q = query(
          orderRef,
          where("email", "==", user.email),
          orderBy("date", "desc")
        );

        try {
          const snapshot = await getDocs(q);
          const fetchedOrders = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Order[];
          setOrders(fetchedOrders);
        } catch (error) {
          console.error("Error fetching orders: ", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [user?.email]);

  if (loading) {
    return (
      <div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-6 w-56" />
        </div>
        <Separator className="my-6" />
        <div>
          <div>
            <Skeleton className="h-10 w-60" />

            <div className="mt-2">
              <div className="box-border mt-4">
                {skeletonItems.map((item) => (
                  <div
                    key={item.id}
                    className="w-[50%] md:w-[25%] lg:w-[20%] xl:w-[15%] 2xl:w-[10%] px-2 float-left mb-5 relative"
                  >
                    <div className="overflow-hidden relative rounded-md">
                      <div className="w-full pb-[140%] relative">
                        <Skeleton className="h-full w-full absolute" />
                      </div>
                    </div>
                    <Skeleton className="mt-2 w-full h-4" />
                    <Skeleton className="mt-2 w-[40%] h-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Manage your book orders.
        </p>
      </div>
      <Separator className="my-6" />
      <div>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="box-border mt-4">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="w-[50%] md:w-[25%] lg:w-[20%] xl:w-[15%] 2xl:w-[10%] px-2 float-left mb-5 relative group"
                  >
                    <Link to={`/orders/book/${order.id}`}>
                      <div className="overflow-hidden relative rounded-md">
                        <div className="w-full pb-[140%] relative">
                          <img
                            src={order.bookImage}
                            alt="book cover"
                            className="h-full w-full absolute group-hover:scale-110 transition-transform duration-1000"
                          />
                          <Badge
                            className="absolute top-2 left-2 opacity-80"
                            variant="secondary"
                          >
                            {order.bookPrice} ৳
                          </Badge>
                          <div className="bg-muted overflow-hidden w-full absolute left-0 bottom-0 h-6 text-sm text-muted-foreground font-semibold leading-6 flex items-center">
                            <span
                              className={`w-3 h-3 rounded-full block ml-2 ${
                                order.state === "pending"
                                  ? "bg-orange-500"
                                  : "bg-green-500"
                              }`}
                            />
                            <span className="ml-1">{order.state}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-base overflow-hidden h-14 max-h-12 mt-2 group-hover:text-foreground transition-colors duration-500">
                        {order.bookName}
                      </p>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="h-[50vh] w-full flex items-center justify-center">
                  <p className="text-muted-foreground">No orders found.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="in-progress">
            <div className="box-border mt-4">
              {orders.filter((order) => order.state === "pending").length >
              0 ? (
                orders
                  .filter((order) => order.state === "pending")
                  .map((order) => (
                    <div
                      key={order.id}
                      className="w-[50%] md:w-[25%] lg:w-[20%] xl:w-[15%] 2xl:w-[10%] px-2 float-left mb-5 relative group"
                    >
                      <Link to={`/orders/book/${order.id}`}>
                        <div className="overflow-hidden relative rounded-md">
                          <div className="w-full pb-[140%] relative">
                            <img
                              src={order.bookImage}
                              alt="book cover"
                              className="h-full w-full absolute group-hover:scale-110 transition-transform duration-1000"
                            />
                            <Badge
                              className="absolute top-2 left-2 opacity-80"
                              variant="secondary"
                            >
                              {order.bookPrice} ৳
                            </Badge>
                            <div className="bg-muted overflow-hidden w-full absolute left-0 bottom-0 h-6 text-sm text-muted-foreground font-semibold leading-6 flex items-center">
                              <span className="w-3 h-3 rounded-full block ml-2 bg-orange-500" />
                              <span className="ml-1">{order.state}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-base overflow-hidden h-14 max-h-12 mt-2 group-hover:text-foreground transition-colors duration-500">
                          {order.bookName}
                        </p>
                      </Link>
                    </div>
                  ))
              ) : (
                <div className="h-[50vh] w-full flex items-center justify-center">
                  <p className="text-muted-foreground">
                    No in-progress orders found.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="delivered">
            <div className="box-border mt-4">
              {orders.filter((order) => order.state === "delivered").length >
              0 ? (
                orders
                  .filter((order) => order.state === "delivered")
                  .map((order) => (
                    <div
                      key={order.id}
                      className="w-[50%] md:w-[25%] lg:w-[20%] xl:w-[15%] 2xl:w-[10%] px-2 float-left mb-5 relative group"
                    >
                      <Link to={`/orders/book/${order.id}`}>
                        <div className="overflow-hidden relative rounded-md">
                          <div className="w-full pb-[140%] relative">
                            <img
                              src={order.bookImage}
                              alt="book cover"
                              className="h-full w-full absolute group-hover:scale-110 transition-transform duration-1000"
                            />
                            <Badge
                              className="absolute top-2 left-2 opacity-80"
                              variant="secondary"
                            >
                              {order.bookPrice} ৳
                            </Badge>
                            <div className="bg-muted overflow-hidden w-full absolute left-0 bottom-0 h-6 text-sm text-muted-foreground font-semibold leading-6 flex items-center">
                              <span className="w-3 h-3 rounded-full block ml-2 bg-green-500" />
                              <span className="ml-1">{order.state}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-base overflow-hidden h-14 max-h-12 mt-2 group-hover:text-foreground transition-colors duration-500">
                          {order.bookName}
                        </p>
                      </Link>
                    </div>
                  ))
              ) : (
                <div className="h-[50vh] w-full flex items-center justify-center">
                  <p className="text-muted-foreground">
                    No delivered orders found.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Orders;
