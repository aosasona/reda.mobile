import { Button, KeyboardAvoidingView, ScrollView } from "native-base";
import { useState } from "react";
import CustomInput from "../../components/custom/CustomInput";
import { ButtonProps } from "../../config/props";
import { RedaService } from "../../services/local";
import { CombinedFileResultType } from "../../types/database";
import { ScreenProps } from "../../types/general";
import { showToast } from "../../utils/notification.util";

export default function EditDetails({ route, navigation }: ScreenProps) {
	const { data: initialData } = route.params;

	if (!initialData) {
		navigation.goBack();
	}

	const [saving, setSaving] = useState(false);
	const [data, setData] = useState<CombinedFileResultType>(initialData);
	const [filename, setFilename] = useState(data.name);

	const handleSave = async () => {
		try {
			setSaving(true);
			await renameDocument();
			showToast("Success", "Changes saved!");
		} catch (e) {
			showToast("Error", "Failed to save changes!");
		} finally {
			setSaving(false);
		}
	};

	const renameDocument = async () => {
		if (filename == data?.name) {
			showToast("Info", "No changes");
			return;
		}
		await RedaService.rename(data.id, filename);
		setData((prev) => ({ ...prev, name: filename }));
	};

	return (
		<ScrollView pt={6}>
			<KeyboardAvoidingView>
				<CustomInput
					name="Name"
					type="text"
					value={filename}
					onChange={setFilename}
				/>
				<Button
					onPress={async () => await handleSave()}
					{...ButtonProps}
					mt={5}
					isLoading={saving}
				>
					Save
				</Button>
			</KeyboardAvoidingView>
		</ScrollView>
	);
}
