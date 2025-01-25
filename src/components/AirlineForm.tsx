import { FlightDestination } from "@/types/FlightDestination";
import Bounded from "./Bounded";
import DatePicker from "./ui/date-picker";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// TODO: implement the airlineForm component

export interface AirlineFormProps {
	destinations: FlightDestination[];
}

export const AirlineForm = ({ destinations }: AirlineFormProps) => {
	return (
		<Bounded>
			<div className="flex flex-col gap-10">
				<h1 className="font-body font-bold text-xl text-center">
					Welcome to the Digido Airlines!
				</h1>
				<div>
					<DatePicker />
				</div>
				<div>
					<RadioGroup defaultValue="option-one">
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="option-one" id="option-one" />
							<Label htmlFor="option-one">Option One</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="option-two" id="option-two" />
							<Label htmlFor="option-two">Option Two</Label>
						</div>
					</RadioGroup>
				</div>
				<div>
					<DropdownMenu>
						<DropdownMenuTrigger>Open</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Profile</DropdownMenuItem>
							<DropdownMenuItem>Billing</DropdownMenuItem>
							<DropdownMenuItem>Team</DropdownMenuItem>
							<DropdownMenuItem>Subscription</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</Bounded>
	);
};
