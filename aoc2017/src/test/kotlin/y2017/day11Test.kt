package y2017

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.io.File

class day11Test {

    fun parseFile(name: String): List<String> {
        val fileUri = javaClass.classLoader.getResource(name).toURI()
        val lines = MutableList(0, { "" })
        File(fileUri).forEachLine { line -> lines.add(line) }
        return lines
    }

    @Test
    fun test1() {
        assertEquals(3, day11("ne,ne,ne").first)
    }

    @Test
    fun test2() {
        assertEquals(0, day11("ne,ne,sw,sw").first)
    }

    @Test
    fun test3() {
        assertEquals(2, day11("ne,ne,s,s").first)
    }

    @Test
    fun test4() {
        assertEquals(3, day11("se,sw,se,sw,sw").first)
    }

    @Test
    fun testActual() {
        assertEquals(670, day11(parseFile("2017/day11ActualInput.txt")[0]).first)
    }

    @Test
    fun testActualSecond() {
        assertEquals(1426, day11(parseFile("2017/day11ActualInput.txt")[0]).second)
    }
}
