package y2018

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.io.File

class day12Test {
    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun test1() {
        assertEquals(325, day12("#..#.#..##......###...###", parseFile("y2018/day12TestInput.txt")))
    }

    @Test
    fun testActual() {
        // 2589 - too low
        assertEquals(2767, day12("..#..###...#####.#.#...####.#..####..###.##.#.#.##.#....#....#.####...#....###.###..##.#....#######",  parseFile("y2018/day12ActualInput.txt")))
    }

    @Test
    fun testActualSecond() {
        assertEquals(2650000001362, day12Second("..#..###...#####.#.#...####.#..####..###.##.#.#.##.#....#....#.####...#....###.###..##.#....#######",  parseFile("y2018/day12ActualInput.txt")))
    }
}
