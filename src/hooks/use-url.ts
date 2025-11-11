import { usePathname, useSearchParams } from "next/navigation";

function useUpdateUrl() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setQueryParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (!value) params.delete(key);
    else params.set(key, value);

    // ⚡ không reload, chỉ update URL
    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
  };

  return { setQueryParam };
}

export default useUpdateUrl;
