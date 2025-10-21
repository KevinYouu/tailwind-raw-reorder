export interface ExpiringMap<K, V> {
	get(key: K): V | undefined;
	set(key: K, value: V): void;
}

export function expiringMap<K, V>(duration: number): ExpiringMap<K, V> {
	const map = new Map<K, { value: V; expiration: Date }>();

	return {
		get(key: K): V | undefined {
			if (map.has(key)) {
				const result = map.get(key);
				if (result && result.expiration > new Date()) {
					return result.value;
				}
			}
		},
		set(key: K, value: V): void {
			const expiration = new Date();
			expiration.setMilliseconds(expiration.getMilliseconds() + duration);

			map.set(key, {
				value,
				expiration,
			});
		},
	};
}
