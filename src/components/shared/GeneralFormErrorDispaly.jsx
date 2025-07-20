export default function GeneralFormErrorDispaly({ form }) {
  return (
    <>
      {form.errors._form && (
        <div className="p-4 mb-4 border-l-4 border-red-500 bg-red-50">
          <p className="text-red-700">{form.errors._form[0]}</p>
        </div>
      )}
    </>
  );
}
