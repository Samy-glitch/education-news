import AccountSettings from "@/components/cards/AccountSettings";
import AppearanceSettings from "@/components/cards/AppearanceSettings";
import NotificationsSettings from "@/components/cards/NotificationsSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserContext } from "@/context/authContext";

const Settings = () => {
  const { isAuthenticated } = useUserContext();
  return (
    <div className="mt-4 md:mt-0">
      <Tabs
        defaultValue={isAuthenticated ? "account" : "appearance"}
        className="w-full"
      >
        <TabsList>
          {isAuthenticated && (
            <TabsTrigger value="account">Account</TabsTrigger>
          )}
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          {isAuthenticated ? (
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          ) : (
            <TabsTrigger value="notifications" disabled>
              Notifications
            </TabsTrigger>
          )}
        </TabsList>
        <div className="mt-6">
          <TabsContent value="account">
            <AccountSettings />
          </TabsContent>

          <TabsContent value="appearance">
            <AppearanceSettings />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Settings;
