from typing import List

from .provider import GoogleServiceProvider

class GoogleSheetsClient:
    def __init__(self):
        self._service = GoogleServiceProvider.get_sheets_service()

    def read_range(self, spreadsheet_id: str, cell_range: str) -> List[List[str]]:
        sheet = self._service.spreadsheets()

        results = sheet.values().get(
            spreadsheetId=spreadsheet_id,
            range=cell_range,
        ).execute()

        return results.get("values", [])

    def read_ranges(self, spreadsheet_id: str, cell_ranges: List[str], major_dimension: str = 'ROWS') -> List[List[List[str]]]:

        results =  self._service.spreadsheets().values().batchGet(
            spreadsheetId=spreadsheet_id,
            ranges=cell_ranges,
            majorDimension=major_dimension,
        ).execute()

        ranges = results.get("valueRanges", [])
        return list(map(lambda r: r.get("values", []), ranges))

    def write_range(
            self,
            spreadsheet_id: str,
            sheet_cell_range: str,
            values: List[List[str]],
            input_option='USER_ENTERED',
            major_dimension: str = 'ROWS',
    ) -> None:
        body = {
            'values': values,
            "majorDimension": major_dimension,
        }

        result = self._service.spreadsheets().values().update(
            spreadsheetId=spreadsheet_id,
            range=sheet_cell_range,
            valueInputOption=input_option,
            body=body,
        ).execute()

    def write_ranges(
        self,
        spreadsheet_id: str,
        sheet_cell_ranges: List[str],
        values: List[List[List[str]]],
        input_option: str = 'USER_ENTERED',
        major_dimension: str = 'ROWS',
    ) -> None:
        assert len(sheet_cell_ranges) == len(values), "Each range must have corresponding values"

        data = []
        for range_, value in zip(sheet_cell_ranges, values):
            data.append({
                "range": range_,
                "majorDimension": major_dimension,
                "values": value,
            })

        body = {
            "valueInputOption": input_option,
            "data": data
        }

        result = self._service.spreadsheets().values().batchUpdate(
            spreadsheetId=spreadsheet_id,
            body=body
        ).execute()
        # TODO: Add exception handling here

    def write_cell(
            self,
            spreadsheet_id: str,
            cell: str,
            value: str,
    ) -> None:
        self.write_range(spreadsheet_id, cell, [[value]])

    def read_cell(self, spreadsheet_id: str, cell: str, ):
        resp = self.read_range(spreadsheet_id, cell)
        return resp[0][0] if resp else None

    def clear_range(self, spreadsheet_id: str, sheet_name: str, cell_range: str):
        full_range = f"{sheet_name}!{cell_range}"
        response = self._service.spreadsheets().values().clear(
            spreadsheetId=spreadsheet_id,
            range=full_range
        ).execute()

        return response

    def clear_ranges(
        self,
        spreadsheet_id: str,
        sheet_cell_ranges: List[str],
    ) -> None:
        body = {
            "ranges" : sheet_cell_ranges
        }

        result = self._service.spreadsheets().values().batchClear(
            spreadsheetId=spreadsheet_id,
            body=body
        ).execute()
        # TODO: Add exception handling here
