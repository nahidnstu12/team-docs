import { Spinner } from "../ui/spinner";

export default function LazyPageLoading({ children }) {
	return <Spinner size="large">{children}</Spinner>;
}
