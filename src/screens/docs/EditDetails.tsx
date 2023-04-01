import { Button, KeyboardAvoidingView, ScrollView } from "native-base";
import { useState } from "react";
import CustomInput from "../../components/custom/CustomInput";
import { ButtonProps } from "../../config/props";
import { showToast } from "../../lib/notification";
import { LocalFileService } from "../../services/local";
import { CombinedFileResultType } from "../../types/database";
import { ScreenProps } from "../../types/general";

export default function EditDetails({ route, navigation }: ScreenProps) {
	const { data: initialData } = route.params;

	if (!initialData) {
		navigation.goBack();
	}

	const [saving, setSaving] = useState(false);
	const [data, setData] = useState<CombinedFileResultType>(initialData);
	const [filename, setFilename] = useState(data.name);
	const [author, setAuthor] = useState(data.author);

	const handleSave = async () => {
		try {
			setSaving(true);
			await renameDocument();
			await changeAuthor();
			showToast("Success", "Changes saved!");
		}
		catch (e) {
			showToast("Error", "Failed to save changes!");
		}
		finally {
			setSaving(false);
		}
	};

	const renameDocument = async () => {
		if (filename == data?.name) return;
		await LocalFileService.rename(data.id, filename);
		setData((prev) => ({ ...prev, name: filename }));
	};

	const changeAuthor = async () => {
		if (author == data?.author) return;
		await LocalFileService.changeAuthor(data.id, author);
		setData((prev) => ({ ...prev, author }));
	};

	return (
		<ScrollView pt={6}>
			<KeyboardAvoidingView>
				<CustomInput name="Name" type="text" value={filename} onChange={setFilename} mb={3} />
				<CustomInput name="Author" type="text" value={author} onChange={setAuthor} />
				<Button onPress={handleSave} {...ButtonProps} mt={10} isLoading={saving}>
					Save
				</Button>
			</KeyboardAvoidingView>
		</ScrollView>
	);
}
