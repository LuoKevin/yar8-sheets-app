import { useState, useEffect } from "react"
import type { Member, StudyGroup, StudyGroupResponse } from "../api/sheet"
import { fetchStudyGroupData } from "../api/sheet"

interface StudyGroupData {
  fetchGroups: () => Promise<void>
  groups: StudyGroup[]
  groupsLoading: boolean
  groupsError: string | null
  manualSetGroups: (newGroups: StudyGroup[]) => void
  scrambleGroups: () => void
}

function chunkArray<T>(arr: T[], n: number): T[][] {
	if (n <= 0) throw new Error("`n` must be a positive integer")
  
	const len = arr.length
	const baseSize = Math.floor(len / n)
	const remainder = len % n
  
	const chunks: T[][] = []
	let offset = 0

	for (let i = 0; i < n; i++) {
		// first `remainder` chunks get an extra element
		const size = baseSize + (i < remainder ? 1 : 0)
		chunks.push(arr.slice(offset, offset + size))
		offset += size
	}

	return chunks
}


function scrambleArr<T>(arr: T[]): T[] {
	// Make a shallow copy so we don't touch the original
	const result = [...arr]
	// Fisher–Yates shuffle
	for (let i = result.length - 1; i > 0; i--) {
		// pick a random index from 0..i
		const j = Math.floor(Math.random() * (i + 1));
		// swap result[i] and result[j]
		[result[i], result[j]] = [result[j], result[i]]
	}
	return result
}


export function useStudyGroupData(date: string): StudyGroupData {
	const [groups, setGroups] = useState<StudyGroup[]>([])
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)

	const manualSetGroups = (newGroups: StudyGroup[]) => {
		setGroups(newGroups)
	}

	const scrambleGroups = () => {
		const allMembers: Member[] = groups.reduce((acc: Member[], group) => acc.concat(group.members), [])
		const randomized = scrambleArr(allMembers)

		const numGroupsToSplit = groups.reduce((acc, group) => group.members.length > 0 ? acc + 1: acc, 0)
		const chunkedArr = scrambleArr(chunkArray(randomized, numGroupsToSplit)).values()

		const scrambledGroups = groups.map((group) => {
			return {
				leader: group.leader,
				members: group.members.length > 0 ? chunkedArr.next().value! : []
			}
		}
		)
		setGroups(scrambledGroups)
	}

	const fetchGroups = async () => {
		setLoading(true)
		setError(null)

		try {
			await fetchStudyGroupData().then(data => {
				setGroups(data)
			})
		} catch (err) {
			setError(err.message || "Unknown error")
		} finally {
			setLoading(false)
		}
	}
	return {fetchGroups, groups, groupsLoading: loading, groupsError: error, manualSetGroups, scrambleGroups}
}
