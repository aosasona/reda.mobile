import { Actionsheet, PresenceTransition } from "native-base";
import { ActionSheetProps } from "../../constants/props";
import {
	backwardTransition,
	forwardTransition,
	transitionAnimation,
} from "../../constants/transition";
import { MetaModalProps, MetaModalSteps } from "../../types/import";
import MetaList from "./MetaList";
import MetaPage from "./MetaPage";

export default function MetaModal({ functions, state }: MetaModalProps) {
	const { isOpen, step, file, meta } = state;
	const { setState, handleModalDismiss, handleComplete } = functions;

	const toggleStep = () =>
		setState((prevState) => ({
			...prevState,
			step:
				prevState.step === MetaModalSteps.ONE
					? MetaModalSteps.TWO
					: MetaModalSteps.ONE,
		}));

	return (
		<Actionsheet
			isOpen={isOpen}
			onClose={handleModalDismiss}
			_backdrop={{ opacity: 0.8 }}
			mb={0}
			pb={0}
		>
			{step === MetaModalSteps.ONE && (
				<Actionsheet.Content
					position="relative"
					px={4}
					pb={0}
					mb={0}
					{...ActionSheetProps}
				>
					<PresenceTransition
						visible={step === MetaModalSteps.ONE}
						initial={backwardTransition}
						animate={transitionAnimation}
					>
						<MetaList state={state} functions={{ ...functions, toggleStep }} />
					</PresenceTransition>
				</Actionsheet.Content>
			)}

			{step === MetaModalSteps.TWO && (
				<Actionsheet.Content {...ActionSheetProps}>
					<PresenceTransition
						visible={step === MetaModalSteps.TWO}
						initial={forwardTransition}
						animate={transitionAnimation}
					>
						<MetaPage
							state={{ data: meta?.current, file }}
							functions={{ handleComplete, toggleStep, handleModalDismiss }}
						/>
					</PresenceTransition>
				</Actionsheet.Content>
			)}
		</Actionsheet>
	);
}
